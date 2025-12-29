<template>
  <v-card class="pa-4">
    <v-row class="align-center mb-2">
      <v-col cols="12" md="6">
        <h2 class="ma-0">Review Requests</h2>
      </v-col>
    </v-row>

    <v-row class="mb-4" align="center">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="Search requests"
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>

      <v-col cols="6" md="3">
        <v-select v-model="statusFilter" :items="statuses" label="Status" clearable />
      </v-col>

      <v-col cols="6" md="3" class="d-flex justify-end">
        <v-btn icon @click="exportCSV" :title="'Export CSV'">
          <v-icon>mdi-export</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      
      :items="filteredRequests"
      item-key="request_id"
      :items-per-page="10"
      class="elevation-1"
    >
      <template #item.request_id="{ item }">
        <div class="text-caption">#{{ item.request_id }}</div>
      </template>

      <template #item.request_type="{ item }">
        <div>{{ item.request_type }}</div>
      </template>

      <template #item.requested_at="{ item }">
        <div>{{ formatDate(item.requested_at) }}</div>
      </template>

      <template #item.request_status="{ item }">
        <v-chip :color="chipColor(item.request_status)" small>
          {{ item.request_status }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              small
              @click="approve(item)"
              :disabled="item.request_status !== 'Pending'"
            >
              <v-icon color="success">mdi-check</v-icon>
            </v-btn>
          </template>
          <span>Approve</span>
        </v-tooltip>

        <v-tooltip location="top" class="ml-2">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              small
              @click="reject(item)"
              :disabled="item.request_status !== 'Pending'"
            >
              <v-icon color="error">mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Reject</span>
        </v-tooltip>
      </template>

      <template v-slot:no-data>
        <v-alert type="info">No review requests found.</v-alert>
      </template>
    </v-data-table>

    <v-snackbar v-model="snackbar.show" :timeout="3000">{{ snackbar.text }}</v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import requestsData from "../../data/review_requests.json";

interface ReviewRequest {
  request_id: number;
  user_id?: number;
  request_type: string;
  old_value?: Record<string, any>;
  new_value?: Record<string, any>;
  request_status: string;
  requested_at?: string;
}

const requests = ref<ReviewRequest[]>([]);
const search = ref("");
const statusFilter = ref<string | null>(null);

const headers: {
  text: string;
  value: string;
  width?: number;
  sortable?: boolean;
  align?: "end" | "start" | "center";
}[] = [
  { text: "ID", value: "request_id", width: 90 },
  { text: "Type", value: "request_type" },
  { text: "Requested At", value: "requested_at", width: 170 },
  { text: "Status", value: "request_status", width: 140 },
  { text: "Actions", value: "actions", sortable: false, align: "end", width: 160 },
];

const statuses = ["Pending", "Approved", "Rejected"];

const snackbar = ref({ show: false, text: "" });

function loadRequests() {
  const base = Array.isArray(requestsData) ? requestsData : [];
  const local = JSON.parse(localStorage.getItem("review_requests_local") || "null");
  requests.value = local && Array.isArray(local) ? local : [...base];
}

onMounted(() => {
  loadRequests();
});

const filteredRequests = computed(() => {
  const q = search.value && search.value.toLowerCase();
  return requests.value.filter((r) => {
    const matchesSearch =
      !q ||
      (r.request_type && r.request_type.toLowerCase().includes(q)) ||
      (r.request_id && String(r.request_id).includes(q));
    const matchesStatus = !statusFilter.value || r.request_status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

function chipColor(status: string) {
  if (status === "Approved") return "success";
  if (status === "Rejected") return "error";
  return "warning";
}

function formatDate(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleString();
}

function persist() {
  try {
    localStorage.setItem("review_requests_local", JSON.stringify(requests.value));
  } catch (e) {
    console.error(e);
  }
}

function approve(item: ReviewRequest) {
  const idx = requests.value.findIndex((r) => r.request_id === item.request_id);
  if (idx === -1) return;
  requests.value[idx] = { ...requests.value[idx], request_status: "Approved" } as ReviewRequest;
  persist();
  snackbar.value = { show: true, text: `Request #${item.request_id} approved` };
}

function reject(item: ReviewRequest) {
  const idx = requests.value.findIndex((r) => r.request_id === item.request_id);
  if (idx === -1) return;
  requests.value[idx] = { ...requests.value[idx], request_status: "Rejected" } as ReviewRequest;
  persist();
  snackbar.value = { show: true, text: `Request #${item.request_id} rejected` };
}

function exportCSV() {
  const rows = filteredRequests.value.map((r) => [
    r.request_id,
    r.request_type,
    r.request_status,
    r.requested_at || "",
  ]);
  const csv = [
    "ID,Type,Status,Requested At",
    ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "review_requests.csv";
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.text-caption {
  font-size: 0.85rem;
}
</style>
