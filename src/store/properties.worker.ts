import {
  IAnnotation,
  IAnnotationProperty,
  IAnnotationPropertyComputeParameters,
  IGeoJSPoint,
  IAnnotationConnection
} from "@/store/model";

function pointDistance(a: IGeoJSPoint, b: IGeoJSPoint) {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

const ctx: Worker = self as any;

const methods: {
  [key: string]: (
    annotation: IAnnotation,
    property: IAnnotationProperty,
    parameters: IAnnotationPropertyComputeParameters
  ) => number;
} = {
  length: (
    annotation: IAnnotation
    // property: IAnnotationProperty,
    // parameters: IAnnotationPropertyComputeParameters
  ) => {
    let sum = 0;
    for (let i = 1; i < annotation.coordinates.length; ++i) {
      sum += pointDistance(
        annotation.coordinates[i - 1],
        annotation.coordinates[i]
      );
    }
    return sum;
  },
  perimeter: (
    annotation: IAnnotation
    // property: IAnnotationProperty,
    // parameters: IAnnotationPropertyComputeParameters
  ) => {
    let sum = 0;
    for (let i = 1; i < annotation.coordinates.length; ++i) {
      sum += pointDistance(
        annotation.coordinates[i - 1],
        annotation.coordinates[i]
      );
    }
    sum += pointDistance(
      annotation.coordinates[0],
      annotation.coordinates[annotation.coordinates.length - 1]
    );
    return sum;
  },
  numberOfConnected: (
    annotation: IAnnotation,
    _: IAnnotationProperty,
    parameters: IAnnotationPropertyComputeParameters
  ) => {
    // TODO: filter by tags
    return (
      parameters.connections?.filter((connection: IAnnotationConnection) => {
        connection.childId === annotation.id ||
          connection.parentId === annotation.id;
      }).length || 0
    );
  },
  averageIntensity: () =>
    // annotation: IAnnotation,
    // property: IAnnotationProperty,
    // parameters: IAnnotationPropertyComputeParameters
    {
      return Math.random() * 1000;
    }
};

// Respond to message from parent thread
ctx.addEventListener("message", event => {
  if (!event.data) {
    return;
  }
  const property: IAnnotationProperty = event.data.property;
  const parameters: IAnnotationPropertyComputeParameters =
    event.data.parameters;

  const method = methods[property.id];
  const annotationIds = parameters.annotations.map(
    (annotation: IAnnotation) => annotation.id
  );
  const values = parameters.annotations.map((annotation: IAnnotation) =>
    method(annotation, property, parameters)
  );
  const result = {
    propertyId: property.id,
    annotationIds,
    values
  };

  ctx.postMessage(result);
});
