<template>
  <v-container>
    <v-row>
      <annotation-property></annotation-property>
    </v-row>
    <v-row><annotation-toggles /></v-row>
    <v-row><annotation-filters /></v-row>
    <v-row><annotation-list @clickedTag="clickedTag"></annotation-list> </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import AnnotationToggles from "@/components/AnnotationBrowser/AnnotationToggles.vue";
import AnnotationFilters from "@/components/AnnotationBrowser/AnnotationFilters.vue";
import AnnotationList from "@/components/AnnotationBrowser/AnnotationList.vue";
import AnnotationProperty from "@/components/AnnotationProperty.vue";
import store from "@/store";
import annotationStore from "@/store/annotation";

import { IAnnotation } from "@/store/model";

@Component({
  components: {
    AnnotationToggles,
    AnnotationFilters,
    AnnotationList,
    AnnotationProperty
  }
})
export default class AnnotationBrowser extends Vue {
  readonly store = store;
  readonly annotationStore = annotationStore;

  clickedTag(tag: string) {
    this.annotationStore.addTagToTagFilter(tag);
  }
}
</script>
