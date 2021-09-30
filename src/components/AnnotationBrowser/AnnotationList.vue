<template>
  <div>
    <v-subheader>Annotation List</v-subheader>
    <v-data-table :items="filtered" :headers="headers">
      <!-- Tags -->
      <template v-slot:item.tags="{ item }">
        <v-chip
          v-for="tag in item.tags"
          :key="tag"
          x-small
          @click="clickedTag(tag)"
          >{{ tag }}</v-chip
        >
      </template>
      <!-- Index -->
      <template v-slot:item.id="{ item }">
        <span>{{ annotations.indexOf(item) }}</span>
      </template>

      <template
        v-for="propertyId in propertyIds"
        v-slot:[`item.${propertyId}`]="{ item }"
      >
        {{ getPropertyValueForAnnotation(item, propertyId) }}
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import store from "@/store";
import annotationStore from "@/store/annotation";
import propertyStore from "@/store/properties";

import { IAnnotation, IAnnotationProperty } from "@/store/model";

@Component({
  components: {}
})
export default class AnnotationList extends Vue {
  readonly store = store;
  readonly annotationStore = annotationStore;
  readonly propertyStore = propertyStore;

  get annotations() {
    return this.annotationStore.annotations;
  }

  get filtered() {
    return this.annotationStore.filteredAnnotations;
  }

  get propertyIds() {
    return this.propertyStore.annotationListIds;
  }

  getPropertyValueForAnnotation(annotation: IAnnotation, propertyId: string) {
    return annotation.computedValues[propertyId] !== undefined
      ? annotation.computedValues[propertyId]
      : "N/A";
  }

  get properties() {
    return [
      ...this.propertyStore.morphologicProperties,
      ...this.propertyStore.relationalProperties,
      ...this.propertyStore.layerDependantProperties
    ].filter((property: IAnnotationProperty) =>
      this.propertyIds.includes(property.id)
    );
  }

  get headers() {
    return [
      {
        text: "Annotation Index",
        value: "id"
      },
      {
        text: "Shape",
        value: "shape"
      },
      {
        text: "Tags",
        value: "tags"
      },
      ...this.properties.map((property: IAnnotationProperty) => ({
        text: property.name,
        value: property.id
      }))
    ];
  }

  @Emit("clickedTag")
  clickedTag(tag: string) {
    return tag;
  }
}
</script>
