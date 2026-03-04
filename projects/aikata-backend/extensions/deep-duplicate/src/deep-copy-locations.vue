<script setup>
import { ref, computed, onMounted } from 'vue';
import { useItems, useApi } from '@directus/extensions-sdk';

const api = useApi();
const collectionRef = ref('locations');

const fromEventDomain = ref(null);
const eventOptions = ref([]);

const toEventDomain = ref(null);

const isLoadingEvents = ref(false);
const isSubmitting = ref(false);
const message = ref('');
const isError = ref(false);

const isDisabled = computed(() => fromEventDomain.value == null || toEventDomain.value == null || isSubmitting.value || isLoadingEvents.value);

const query = {
  fields: ref(['domain', 'name']),
  limit: ref(-1),
  sort: ref(null),
  search: ref(null),
  filter: ref(null),
  page: ref(1)
}

const { getItems, items } = useItems(collectionRef, query);

async function loadEvents() {
  isLoadingEvents.value = true;
  try {
    await getItems();
    eventOptions.value = items.value.map((ev) => ({
      text: ev.name,
      value: ev.domain,
    }));
  } catch (e) {
    console.error(e);
    eventOptions.value = [];
  } finally {
    isLoadingEvents.value = false;
  }
}

onMounted(loadEvents);

async function onDuplicate() {
  isSubmitting.value = true;
  message.value = '';
  isError.value = false;
  try {
    const { data: events } = await api.get('/items/events', {
      params: {
        filter: { domain: { _eq: fromEventDomain.value } },
        deep: {
          categories: {
            _limit: -1
          },
          programs: {
            _limit: -1,
            acts: {
              _limit: -1,
              location: {
                _limit: -1
              }
            },
            categories: {
              _limit: -1
            }
          },
          map: {
            _limit: -1
          },
          ui_config: {
            _limit: -1
          },
          information_pages: {
            _limit: -1
          },
          locations: {
            _limit: -1,
            categories: {
              _limit: -1
            }
          }
        },
        fields: [
          'categories',
          'categories.name',
          'app_title',
          'information_pages',
          'information_pages.content',
          'information_pages.iframe_url',
          'information_pages.sort',
          'information_pages.title',
          'programs',
          'programs.banner_image',
          'programs.categories',
          'programs.categories.name',
          'programs.long_description',
          'programs.name',
          'programs.secondary_image',
          'programs.short_description',
          'programs.acts',
          'programs.acts.act_name',
          'programs.acts.attendence',
          'programs.acts.continuous',
          'programs.acts.date',
          'programs.acts.end_time',
          'programs.acts.event_name',
          'programs.acts.start_time',
          'programs.acts.status_message',
          'programs.acts.location',
          'map.image',
          'map.initially_focused_latitude',
          'map.initially_focused_longitude',
          'map.status',
          'map.zoom_level',
          // 'ui_config.*',
          'banner_image',
          'has_super_access',
          'locations',
          'locations.categories',
          'locations.categories.event_categories_id.name',
          'locations.banner_image',
          'locations.icon',
          'locations.icon_background',
          'locations.long_description',
          'locations.map_coordinate_x',
          'locations.map_coordinate_y',
          'locations.name',
          'locations.secondary_image',
          'locations.short_description',
          'locations.type',
          'locations.status_message',
        ]
      }
    });



    const { data } = await api.post('/items/events', newEvent);
    console.log(data);
    message.value = 'Event Duplicated!';
    isError.value = false;
  } catch (err) {
    isError.value = true;
    message.value = err?.response?.data?.error ?? err?.message ?? 'Duplication failed.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="content">
    <div class="title">
      <h3 class="type-title">Duplicate Location:</h3>
    </div>
    <div class="row">
      <div style="display: flex; gap: 12px; flex-direction: column">
        <div class="field-label type-label">
          <span class="field-name">
            <div class="v-text-overflow">Select Event(To Copy From)</div>
          </span>
        </div>
        <div>
          <VSelect
            v-model="fromEventDomain"
            :items="eventOptions"
            label="Select Event"
            :disabled="isSubmitting || isLoadingEvents"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div style="display: flex; gap: 12px; flex-direction: column">
        <div class="field-label type-label">
          <span class="field-name">
            <div class="v-text-overflow">Select Event(To Copy To)</div>
          </span>
        </div>
        <div>
          <VSelect
            v-model="toEventDomain"
            :items="eventOptions"
            label="Select Event"
            :disabled="isSubmitting || isLoadingEvents"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <VButton :loading="isSubmitting" :disabled="isDisabled" @click="onDuplicate">
        Duplicate Location
      </VButton>
    </div>

    <div v-if="message" class="message" :class="{ error: isError, success: !isError }">
      <pre>{{ message }}</pre>
    </div>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: var(--content-padding);
  padding-top: 0;
  padding-bottom: var(--content-padding-bottom)
}
.row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}
.message {
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 14px;
}
.message.success {
  background: #e6ffed;
  color: #027a48;
  border: 1px solid #abefc6;
}
.message.error {
  background: #ffefef;
  color: #b42318;
  border: 1px solid #fda29b;
}
</style>
