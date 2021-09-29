<template>
  <v-card>
    <v-card-title class="pa-1">
      <v-subheader>Filters</v-subheader>
    </v-card-title>
    <v-card-text class="pa-2">
      <v-container>
        <v-row>
          <v-col class="pa-0">
            <tag-filter-editor v-model="tagFilter"></tag-filter-editor>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, VModel } from "vue-property-decorator";
import store from "@/store";
import annotationStore from "@/store/annotation";
import { ITagAnnotationFilter } from "@/store/model";
import TagFilterEditor from "@/components/TagFilterEditor.vue";
@Component({
  components: {
    TagFilterEditor
  }
})
export default class AnnotationFilter extends Vue {
  readonly store = store;
  readonly annotationStore = annotationStore;

  @Prop()
  readonly additionalTags!: string[];

  tagSearchInput: string = "";

  get tagFilter() {
    return this.annotationStore.tagFilter;
  }
  set tagFilter(filter: ITagAnnotationFilter) {
    this.annotationStore.setTagFilter(filter);
  }
}
</script>
