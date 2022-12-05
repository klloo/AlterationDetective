<template>
	<ul class="tal">
		<li class="list_item">
			<p class="fs_24 mb_16">
				<span class="fw_600">강남구 봉은사로</span>
				근처의
				<br>
				수선집을 추천하고 있어요!
			</p>
			<p class="mb_8">추천수선집</p>
			<div>
				<span class="RECOMMEND"></span>
				<p class="mb_8 fw_600">
					수선탐정 수선집
					<span class="specialty">교복</span>
				</p>
				<div class="mb_8 d_flex">
					<div class="recommend_info">
						<span class="STAR"></span>
						<span class="star_score">4.0</span>
					</div>
					<div class="recommend_info">
						<span>리뷰</span>
						<span>286</span>
					</div>
					<div class="recommend_info">
						<span>230</span>
						<span>m</span>
					</div>
				</div>
				<div class="mb_8 d_flex align_center justify_between">
					<span class="address">서울 강남구 삼성동 123-456</span>
					<span class="LIKE_GRAY" v-if="likeBlue === false" @click="likeBlue = true"></span>
					<span class="LIKE_BLUE" v-if="likeBlue === true"  @click="likeBlue = false"></span>
				</div>
			</div>
		</li>
	</ul>
</template>
<script>
export default {
	name: 'Recommend',
	data() {
    return {
		likeBlue: false,
    };
  },
}
</script>

<style lang="css">
.RECOMMEND {
	display: block;
	width: 343px;
	height: 136px;
	margin-bottom: 8px;
}
.STAR {
	display: inline-block;
	width: 14px;
	height: 14px;
}
.LIKE_GRAY,
.LIKE_BLUE {
	display: inline-block;
	width: 24px;
	height: 24px;
}
.recommend_info {
	width: auto;
	margin-right: 4px;
}
.recommend_info:last-child {
	margin: 0;
}
.recommend_info:nth-child(even) {
	border-left: 1px solid #ACB4BC;
	border-right: 1px solid #ACB4BC;
	padding: 0 4px;
}
.specialty {
	font-size: 12px;
	font-weight: 400;
	color: #72757A;
}
.list_item {
	border-bottom: 1px solid #DDE3E7;
}
</style>
