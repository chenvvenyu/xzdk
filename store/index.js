import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin:false,
		userInfo: {},
		unionId:'',
		userType:0,
		openId:'',
		menuInfo:{}
	},
	mutations: {
		//只能传一个参数，后面的参数无效，undefined
		login(state, data) {
			state.hasLogin=true;
			state.userInfo=data;
		},
		logout(state) {
			state.hasLogin=false;
			state.userInfo = {};
		},
		saveID(state, data){
			state.unionId=data.unionId;
			state.openId=data.openId;
		},
		setMenuInfo(state,data){
			state.menuInfo = data
		},
		setUserType(state,data){
			state.userType= data
		}
	}
})

export default store
