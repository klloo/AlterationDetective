<template>
	<div :class="['modal_m', addClass]">
		<div class="overlay_m"></div>
		<div class="modal_card_m message">
			<div class="modal_header tal">
				<span v-if="showClose" class="modal_close" @click="closeModal"></span>
			</div>
			<slot />
		</div>
	</div>
</template>

<script>
import '@/assets/css/modal.m.css';
export default {
	name: 'ModalMessage.m',
	props: {
		addClass: {
			type: String,
			default: '',
		},
		showClose: {
			type: Boolean,
			default: true,
		},
	},
	mounted() {
		document.body.classList.add('overflow_h');
		document.querySelector('.modal_card_m.message').classList.add('slide-up');
	},
	beforeUnmount() {
		document.body.classList.remove('overflow_h');
	},
	methods: {
		closeModal() {
			document
				.querySelector('.modal_card_m.message')
				.classList.remove('slide-up');
			document
				.querySelector('.modal_card_m.message')
				.addEventListener('animationend', () => {
					this.$emit('closeModal');
				});
			document
				.querySelector('.modal_card_m.message')
				.classList.add('slide-down');
		},
	},
};
</script>

<style scoped></style>
