<template>
	<web-view :src="webUrl" class="container-warp"></web-view>
</template>

<script>
	import VerifyHelper from '../../common/verify.js'
	export default {
		data(){
			return{
				webUrl:'https://www.zjxztc.com/UserAgreement.html'
			}
		},
		methods:{
			
		},
		onLoad(options) {
			let _self = this
			switch(options.type){
				case 'pivacyPolicy':{
					_self.webUrl = 'https://www.zjxztc.com/Privacy.html'
				}break;
				case 'userAgreement':{
					_self.webUrl = 'https://www.zjxztc.com/UserAgreement.html'
				}break;
				case 'aboutCompany':{
					_self.webUrl = 'https://www.zjxztc.com/AboutUs.html'
				}break;
				default:
					_self.webUrl = ''
				break;
			}
		}
	}
</script>

<style>
</style>
