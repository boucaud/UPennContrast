<template>
  <v-row>
    <!-- Enabled / Computed -->
    <v-col class="pa-0">
      <v-checkbox dense hide-details v-model="property.enabled"></v-checkbox>
    </v-col>
    <!-- In list (???) -->
    <v-col class="pa-0">
      <v-checkbox
        dense
        hide-details
        :value="list"
        @click="toggleList"
      ></v-checkbox>
    </v-col>
    <!-- As filter -->
    <v-col class="pa-0">
      <v-checkbox
        dense
        hide-details
        :value="filter"
        @click="toggleFilter"
      ></v-checkbox>
    </v-col>
    <v-col class="pa-0" cols="8">
      <v-row>
        <v-col class="pa-0">
          <v-subheader class="pa-0">
            {{ property.name }}
          </v-subheader>
        </v-col>
        <v-col class="pa-0">
          <layer-select
            v-if="property.layer !== undefined"
            v-model="property.layer"
            label=""
            :any="false"
          ></layer-select>
          <tag-filter-editor
            v-else-if="property.filter !== undefined"
            :filter="property.filter"
          ></tag-filter-editor>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import TagFilterEditor from "@/components/TagFilterEditor.vue";
import LayerSelect from "@/components/LayerSelect.vue";

import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import propertyStore from "@/store/properties";

@Component({
  components: {
    TagFilterEditor,
    LayerSelect
  }
})
export default class AnnotationProperty extends Vue {
  readonly propertyStore = propertyStore;

  @Prop()
  private readonly property!: any;

  get filter() {
    return this.propertyStore.filterIds.includes(this.property.id);
  }

  get list() {
    return this.propertyStore.annotationListIds.includes(this.property.id);
  }

  toggleFilter() {
    if (this.filter) {
      this.propertyStore.removeFilterId(this.property.id);
    } else {
      this.propertyStore.addFilterId(this.property.id);
    }
  }

  toggleList() {
    if (this.list) {
      this.propertyStore.removeAnnotationListId(this.property.id);
    } else {
      this.propertyStore.addAnnotationListId(this.property.id);
    }
  }
}
</script>
