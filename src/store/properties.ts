import {
  getModule,
  Action,
  Module,
  Mutation,
  VuexModule
} from "vuex-module-decorators";
import store from "./root";

import sync from "./sync";
import annotation from "./annotation";

import Worker from "worker-loader!@/store/properties.worker.ts";

import {
  IAnnotation,
  IAnnotationConnection,
  IMorphologicAnnotationProperty,
  IAnnotationProperty,
  IRelationalAnnotationProperty,
  ILayerDependentAnnotationProperty,
  IAnnotationPropertyComputeParameters,
  ITagAnnotationFilter
} from "./model";
import { values } from "lodash-es";
import { logWarning } from "@/utils/log";

// TODO: mutations for properties
// TODO: this means we probably need to regroup them all under one array
@Module({ dynamic: true, store, name: "properties" })
export class Properties extends VuexModule {
  computedValues: {
    [propertyId: string]: { annotationIds: string[]; values: number[] };
  } = {};
  morphologicProperties: IMorphologicAnnotationProperty[] = [
    {
      id: "length",
      name: "Length",

      enabled: false,
      computed: false,

      requiredShape: "line"
    },
    {
      id: "perimeter",
      name: "Perimeter",

      enabled: false,
      computed: false,
      requiredShape: "polygon"
    }
  ];

  relationalProperties: IRelationalAnnotationProperty[] = [
    {
      id: "numberOfConnected",
      name: "Number Of Connected",

      enabled: false,
      computed: false,

      independant: true,

      filter: {
        id: "numberOfConnectedFilter",
        tags: [],
        shape: "polygon",
        exclusive: true,
        enabled: true
      }
    },
    {
      id: "distanceToNearest",
      name: "Distance To Nearest",

      enabled: false,
      computed: false,

      independant: false,

      filter: {
        id: "distanceToNearestFilter",
        tags: [],
        shape: "polygon",
        exclusive: true,
        enabled: true
      }
    }
  ];

  layerDependantProperties: ILayerDependentAnnotationProperty[] = [
    {
      id: "averageIntensity",
      name: "Average Intensity",

      enabled: false,
      computed: false,

      layer: 0
    }
  ];

  annotationListIds: string[] = [];

  worker: Worker = new Worker();
  initializedWorker: boolean = false;

  @Mutation
  updatePropertyValues({
    propertyId,
    annotationIds,
    values
  }: {
    propertyId: string;
    annotationIds: string[];
    values: number[];
  }) {
    if (annotationIds.length !== values.length) {
      logWarning("Inconsistent computed property results");
      return;
    }
    if (!this.computedValues[propertyId]) {
      this.computedValues[propertyId] = { annotationIds, values };
    } else {
      for (let index = 0; index < annotationIds.length; ++index) {
        const id = annotationIds[index];
        const value = values[index];
        const existingIndex = this.computedValues[
          propertyId
        ].annotationIds.indexOf(id);
        if (existingIndex !== -1) {
          this.computedValues[propertyId].values[existingIndex] = value;
        } else {
          this.computedValues[propertyId].annotationIds.push(id);
          this.computedValues[propertyId].values.push(value);
        }
      }
    }
    this.computedValues = { ...this.computedValues };
  }

  @Action
  onWorkerMessage(message: any) {
    const propertyId: string = message.data.propertyId;
    const property = this.getPropertyById(propertyId);
    if (!property) {
      return;
    }
    this.updatePropertyValues(message.data);
    this.replaceProperty({ ...property, computed: true });
  }

  @Mutation
  addAnnotationListId(id: string) {
    if (!this.annotationListIds.includes(id)) {
      this.annotationListIds = [...this.annotationListIds, id];
    }
  }

  @Mutation
  removeAnnotationListId(id: string) {
    if (this.annotationListIds.includes(id)) {
      this.annotationListIds = this.annotationListIds.filter(
        testId => id !== testId
      );
    }
  }

  get properties(): IAnnotationProperty[] {
    return [
      ...this.morphologicProperties,
      ...this.relationalProperties,
      ...this.layerDependantProperties
    ];
  }
  @Mutation
  hasInitializedWorker() {
    this.initializedWorker = true;
  }

  @Mutation
  replaceProperty(property: IAnnotationProperty) {
    // TODO: ideally conserve index so the list doesn't shuffle around
    // TODO: or sort alphabetically
    const find = (prop: IAnnotationProperty) => prop.id === property.id;
    const filter = (prop: IAnnotationProperty) => prop.id !== property.id;
    if (this.morphologicProperties.find(find)) {
      this.morphologicProperties = [
        ...this.morphologicProperties.filter(filter),
        property as IMorphologicAnnotationProperty
      ];
    } else if (this.relationalProperties.find(find)) {
      this.relationalProperties = [
        ...this.relationalProperties.filter(filter),
        property as IRelationalAnnotationProperty
      ];
    } else if (this.layerDependantProperties) {
      this.layerDependantProperties = [
        ...this.layerDependantProperties.filter(filter),
        property as ILayerDependentAnnotationProperty
      ];
    }
  }

  get getPropertyById() {
    return (id: string) => {
      const find = (prop: IAnnotationProperty) => prop.id === id;
      const morph = this.morphologicProperties.find(find);
      if (morph) {
        return morph as IAnnotationProperty;
      }
      const relational = this.relationalProperties.find(find);
      if (relational) {
        return relational as IAnnotationProperty;
      }
      const layer = this.layerDependantProperties.find(find);
      if (layer) {
        return layer as IAnnotationProperty;
      }
      return null;
    };
  }

  @Action
  disableProperty(property: IAnnotationProperty) {
    this.replaceProperty({ ...property, enabled: false });
  }

  @Action
  enableProperty(property: IAnnotationProperty) {
    this.replaceProperty({ ...property, enabled: true, computed: false });

    const newProp = this.getPropertyById(property.id);
    if (newProp) {
      this.computeProperty(newProp);
    }
  }

  get eligibleAnnotationsForPropertyId() {
    return (id: string) => {
      const morph = this.morphologicProperties.find(
        (property: IMorphologicAnnotationProperty) => property.id === id
      );
      if (morph && morph.requiredShape) {
        return annotation.annotations.filter(
          (annotation: IAnnotation) => annotation.shape === morph.requiredShape
        );
      }
      return annotation.annotations;
    };
  }

  @Action
  async computeProperty(property: IAnnotationProperty) {
    if (!property.enabled) {
      return;
    }
    if (!this.initializedWorker) {
      this.worker.addEventListener("message", (event: any) => {
        this.onWorkerMessage(event);
      });
      this.hasInitializedWorker();
    }

    this.replaceProperty({ ...property, computed: false });
    const newProperty = this.getPropertyById(property.id);

    const parameters: IAnnotationPropertyComputeParameters = {
      annotationsToCompute: this.eligibleAnnotationsForPropertyId(property.id),
      additionalAnnotations: annotation.annotations, // TODO: not always needed
      connections: annotation.annotationConnections,
      image: null // TODO:
    };

    this.worker.postMessage({
      property: newProperty,
      parameters
    });
  }

  @Action
  async handleNewAnnotation(
    newAnnotation: IAnnotation,
    newConnections: IAnnotationConnection[],
    image: any
  ) {
    if (!this.initializedWorker) {
      this.worker.addEventListener("message", event =>
        this.onWorkerMessage(event)
      );
      this.hasInitializedWorker();
    }
    const shapeFilter = (property: IMorphologicAnnotationProperty) =>
      property.requiredShape !== null &&
      property.requiredShape === newAnnotation.shape;
    const enabledFilter = (property: IAnnotationProperty) => property.enabled;
    [
      ...this.morphologicProperties.filter(shapeFilter),
      ...this.relationalProperties,
      ...this.layerDependantProperties
    ]
      .filter(enabledFilter)
      .forEach((property: IAnnotationProperty) => {
        this.replaceProperty({ ...property, computed: false });
        const newProperty = this.getPropertyById(property.id);
        this.worker.postMessage({
          property: newProperty,
          parameters: {
            annotationsToCompute: [newAnnotation],
            additionalAnnotations: annotation.annotations,
            connections: annotation.annotationConnections, // TODO: not always needed to send all this
            image
          }
        });
      });
  }
}

export default getModule(Properties);
