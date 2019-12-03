import Home from "./Home.vue";
import Dataset, { routes as datasetRoutes } from "./dataset";
import NewDataset from "./dataset/NewDataset.vue";
import ImportDataset from "./dataset/ImportDataset.vue";
import { Main } from "@/store";

export default [
  {
    path: "/",
    name: "root",
    component: Home,
    meta: {
      hidden: true
    }
  },
  {
    path: "/new",
    name: "newdataset",
    component: NewDataset,
    meta: {
      text: "New Dataset"
    }
  },
  {
    path: "/import",
    name: "importdataset",
    component: ImportDataset,
    meta: {
      text: "Import Dataset"
    }
  },
  {
    path: "/:id",
    props: true,
    component: Dataset,
    children: datasetRoutes,
    meta: {
      name: "dataset",
      text(store: Main) {
        return store.dataset?.name || store.selectedDatasetId;
      }
    }
  }
];
