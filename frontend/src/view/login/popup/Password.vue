<template>
	<div class="password_forgot">
		<div class="mb_32 d_flex align_center mb_32">
            <span class="BACKARR mr_16" @click="$emit('home')"></span>
			<span class="fw_400 fs_20">비밀번호 재설정</span>
        </div>
		<div v-if="passwordReset === false">
			<p class="fs_20 title">
				가입했던 이메일을 입력해 주세요
				<br>
				비밀번호 재설정 메일을 보내드립니다.
			</p>
			<div class="input_box mb_40">
				<input type="password" class="mail" placeholder="name@email.com" v-model="userId" />
        	</div>
			<button class="button_w100 blue" @click="passwordReset = true">비밀번호 재설정하기</button>
		</div>
		<div v-if="passwordReset === true">
			<p class="fs_20 title">
				새로운 비밀번호를 입력해 주세요.
			</p>
			<div class="input_box mb_40">
				<input type="password" class="password" placeholder="새로운 비밀번호를 입력해 주세요." v-model="userId" />
				<input type="password" class="password" placeholder="비밀번호를 한번 더 입력하세요." v-model="userId" />
        	</div>
			<button class="button_w100 blue">비밀번호 재설정하기</button>
		</div>
	</div>
</template>
<script>
export default {
	name: 'Password',
	data() {
    return {
		passwordReset: false,
    };
  },
}
</script>

<style lang="css">
.password_forgot {
	margin-top: 63px;
}
.side_title {

}
</style>
