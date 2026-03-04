<template>
	<private-view>
		<deep-copy-event />
	</private-view>
</template>

<script setup>
import deepCopyEvent from './deep-copy-event.vue';
</script>

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
