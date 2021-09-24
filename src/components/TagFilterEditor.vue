<template>
  <span>
    {{ filter.tags }}
  </span>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import store from "@/store";
import propertyStore from "@/store/properties";

@Component({})
export default class TagFilterEditor extends Vue {
  readonly store = store;
  readonly propertyStore = propertyStore;

  @Prop()
  readonly filter: any;
}
</script>
