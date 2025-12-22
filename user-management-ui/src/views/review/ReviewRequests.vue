<v-data-table :items="requests">
  <template #item.request_status="{ item }">
    <v-chip color="warning">{{ item.request_status }}</v-chip>
  </template>

  <template #item.actions="{ item }">
    <v-btn color="success">Approve</v-btn>
    <v-btn color="error">Reject</v-btn>
  </template>
</v-data-table>
