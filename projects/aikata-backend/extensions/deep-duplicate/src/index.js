import ModuleComponent from './module.vue';

export default {
	id: 'deep-duplicate-module',
	name: 'Deep Duplicate Module',
	icon: 'box',
	routes: [
		{
			path: '',
			component: ModuleComponent,
		},
	],
};
