<template>
	<!-- <div :class="['modal_m', addClass]"> -->
		<!-- <div class="overlay_m"></div> -->
		<div class="modal_card_m">
			<span class="height_handler" @click="closeModal"></span>
			<div class="modal_header tal">
				<slot name="title"></slot>
				<span class="modal_close" @click="closeModal"></span>
			</div>
			<div class="modal_scrollable">
				<slot />
			</div>
		</div>
	<!-- </div> -->
</template>

<script>
import '@/assets/css/modal.m.css';
export default {
	name: 'ModalView.m',
	props: {
		addClass: {
			type: String,
			default: '',
		},
	},
	mounted() {
		const height = window.innerHeight * 0.9;
		document.querySelector('.modal_card_m').style.maxHeight = height + 'px';
		document.querySelector('.modal_scrollable').style.maxHeight =
			height * 0.9 - 50 + 'px';
		document.body.classList.add('overflow_h');
		document.querySelector('.modal_card_m').classList.add('slide-up');
	},
	beforeUnmount() {
		document.body.classList.remove('overflow_h');
	},
	methods: {
		closeModal() {
			document.querySelector('.modal_card_m').classList.remove('slide-up');
			document
				.querySelector('.modal_card_m')
				.addEventListener('animationend', () => {
					this.$emit('closeModal');
				});
			document.querySelector('.modal_card_m').classList.add('slide-down');
		},
	},
};
</script>
<style scoped>
.height_handler {
	height: 3px;
	width: 56px;
	background: #000;
	display: inline-block;
}
.modal_close {

}
</style>
