Vue.config.devtools = true

var eventBus = new Vue() //global ebent

Vue.component('product', {
	props: {
		premium: { //premium dlm props ni dapat data drpd attr kt parent
			type: Boolean,
			required: true
		}
	},
	template:`
		<div class="product stack-top">
			<div class="product-image">
				<img :src="image">
			</div>
			<div class="box"></div>
			
			<div class="product-info">
				<h1>{{ title }}</h1>
				<p>{{ shipping }} for shipping</p>

				<!--<a :href="link">Link here</a>-->

				<p v-if="inStock > 10">In Stock [{{inStock}}] items remaining</p>
				<p v-else-if="inStock <= 10 && inStock > 0">Almost sold out! [{{inStock}}] items remaining</p>
				<p v-else>Out of Stock</p>
				<!--premium ni dpt data drpd props-->
				<p>User is premium: {{ premium }}</p> 

				<p>Description</p>
				<p style="fontSize:16px">{{ description }}</p>

				<info-tabs :shipping="shipping" :details="details"></info-tabs>

				<!--referencing color drpd variantColor-->
				<div class="color-box"
					 v-for="(variant, index) in variants"
					 :key="variant.variantId"
					 
					 :style="{ backgroundColor: variant.variantColor }"
					 @mouseover="updateProduct(index)">
				</div>

				<!--2-->
				<div class="buttons">
					<button type="button"
						class="btn btn-primary" 
						@click="addToCart" 
						:disabled="!inStock"
						:class="{ disabledButton: !inStock }" 
						>Add to Cart</button>
					<button type="button" class="btn btn-secondary" @click="removeFromCart">Remove from Cart</button>
				</div>
				
				<!--nama event = nama method dalam component dia-->
				<!--tempat asal product tab-->
			
			</div>
		</div>
	`,
	data(){

		return{
			product: 'Running Shoes',
			brand: 'Nike',
			selectedVariant: 0,
			price: "$200.95",
			description: 'The Nike Joyride Run Flyknit is designed to help make running feel easier and give your legs a day off. Tiny foam beads underfoot conform to your foot for cushioning that stands up to your mileage.',
			link: 'https://www.google.com/search?q=yarn&rlz=1C1CHBF_enMY813MY813&sxsrf=ALeKk03T6LKCnoaLQVSwRDM4ASMcgKSoCw:1598353216470&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjdxsXdmbbrAhXJxTgGHalEBScQ_AUoAXoECBAQAw&biw=681&bih=687#imgrc=5igDdyScoaNhYM&imgdii=XWkU_JNHm2NAsM',
			details: [
						'Rubber sole', 
						'Revolutionary cushioning technology utilizes tiny foam beads for a bouncy, ultra-cushy running experience', 
						'Flyknit textile upper hugs the foot',
						'1-piece foam collar for comfort',
						'Low-cut design for ankle mobility',
						'Durable rubber sole'],
			variants: [
				{//index 0
					variantId: 1,
					variantColor: "pink",
					variantImage: "./image/shoes1.jpg",
					variantQuantity: 10
				},
				{//index 1
					variantId: 2,
					variantColor: "white",
					variantImage: "./image/shoes2.jpg",
					variantQuantity: 20
				}
			]
			//reviews: []
		}
		
	},

	methods: {
		addToCart: function(){
			this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
		},
		updateProduct: function(index){
			this.selectedVariant = index //ex: i pass index 1
		},
		removeFromCart: function(){
			this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
		}
		//method ni amik productReview
		/*addReview(productReview){
			//push productReview ke dalam array reviews
			this.reviews.push(productReview)
		}*/
	},

	computed: {
		title(){
			return this.brand + ' ' + this.product
		},
		image(){ //return gbr ikut index 1 tu ke data image yg dah bind dkt src attr.
			return this.variants[this.selectedVariant].variantImage
		},
		inStock(){
			return this.variants[this.selectedVariant].variantQuantity
		},
		shipping() {
	    	if (this.premium) {
	    		return "Free"
	      	}	
	      	else {
	        	return 2.99
	      	}
	    }
	}
})

/*Vue.component('product-details', {
	props: {
		details: {
			type: Array,
			required: true
		}
	},
	template: `
		<ul>
			<li v-for="detail in details">{{ detail }}</li>
		</ul>
		`
})*/

Vue.component('product-review', {
	template: `
		<form @submit.prevent="onSubmit">

			<!--check if errors has a length. if errors not empty, display-->
			<div class="form-group">
				<label for="error-message">
					<p v-if="errors.length">
						<b>Please correct the following error(s)</b>
						<ul>
							<li v-for="error in errors">{{ error }}</li>
						</ul>
					</p>
				</label>
			</div>
			
			<div class="form-group">
				<!--for specifies which form element a label is bound to-->
				<label for="name">Name:</label>
				<input id="name" class="form-control" v-model="name" placeholder="name">
			</div>
			<div class="form-group">
				<label for="review">Review:</label>
				<textarea id="review" class="form-control" v-model="review"></textarea>
			</div>
			<div class="form-group">
				<label for="rating">Rating:</label>
				<select id="rating" class="form-control" v-model.number="rating">
					<option>5</option>
					<option>4</option>
					<option>3</option>
					<option>2</option>
					<option>1</option>
				</select>
			</div>
			<div class="form-group">	
				<label>Would you recommend this product?</label>
				<input type="radio" id="yes" v-model="recommendation" name="recommendation" value="yes">
				<label for="yes">Yes</label>
				<input type="radio" id="no" v-model="recommendation" name="recommendation" value="no">
				<label for="no">No</label>
			</div>
			<button type="submit" class="btn btn-primary" value="Submit">Submit</button>
		</form>
	`,
	data(){
		return {
			name: null,
			review: null,
			rating: null,
			recommendation: null,
			errors: []
		}
	},
	methods: {
		onSubmit() {
			
			this.errors = []

			if(this.name && this.review && this.rating && this.recommendation){
				let productReview = {
				name: this.name,
				review: this.review,
				rating: this.rating,
				recommendation: this.recommendation
				}
				//nama event, value
				eventBus.$emit('review-submitted', productReview)
				this.name = null
				this.review = null
				this.rating = null
				this.recommendation = null
			}
			
			else {
				if(!this.name) this.errors.push("Name required.")
				if(!this.rating) this.errors.push("Rating required.")
				if(!this.review) this.errors.push("Review required.")
				if(!this.recommendation) this.errors.push("Recommendation required")
			}
		}
	}	
})

Vue.component('product-tabs', {
	props: {
		reviews: {
			type: Array,
			required: false
		}
	},

	template: `
		<div>
			<div>
				<span class="tabs" 
					  :class="{ activeTab: selectedTab === tab }"
					  v-for="(tab, index) in tabs" 
					  @click="selectedTab = tab"
					  :key="tab">{{ tab }}
				</span>
			</div>

			<div v-show="selectedTab === 'Reviews'">
				<p v-if="!reviews.length">There are no reviews yet.</p>
				<div v-else>
					<div class="review-box" v-for="(review,index) in reviews"
						:key="index">
						<div class="container">
							<div class="row">
								<div class="col">
									<h4>{{ review.name }}</h4> 
								</div>
								<div class="col">
									<div v-if="review.rating == 1">&#9733;&#9734;&#9734;&#9734;&#9734;</div>
									<div v-else-if="review.rating == 2">&#9733;&#9733;&#9734;&#9734;&#9734;</div>
									<div v-else-if="review.rating == 3">&#9733;&#9733;&#9733;&#9734;&#9734;</div>
									<div v-else-if="review.rating == 4">&#9733;&#9733;&#9733;&#9733;&#9734;</div>
									<div v-else>&#9733;&#9733;&#9733;&#9733;&#9733;</div>
								</div>
							</div>
							<div class="row">
								<div class="col">
									<p>{{ review.review }}</p>
								</div>
							</div>
						</div>
						
					</div>
				</div>
			</div>

			<div v-show="selectedTab === 'Make a Review'">
				<product-review></product-review>
			</div>
		</div>
	`,	
	data(){
		return{
			tabs: ['Reviews', 'Make a Review'],
			selectedTab: 'Reviews'
		}
	}
})

Vue.component('info-tabs', {
	props: {
		shipping: {
			required: true
		},
	    details: {
	        type: Array,
	        required: true
	    }
	},
	template: `
		<div class="info-tab-box">
			<span class="infos"
				  :key="info"
				  v-for="(info, index) in infos"
				  :class="{ activeTab: selectedInfo === info }"
				  @click="selectedInfo = info ">
				  {{ info }}
			</span>

			<div v-show="selectedInfo === 'Shipping'">
				<p>{{ shipping }}</p>
			</div>
			<div v-show="selectedInfo === 'Details'">
				<ul>
					<li v-for="detail in details">{{ detail }}</li>
				</ul>
			</div>
		</div>
	`,

	data(){
		return{
			infos: ['Shipping' ,'Details'],
			selectedInfo: 'Shipping'
		}
	}
})

var app = new Vue({
	el: "#app",
	data: {
		premium: true, //Data ni kena bind dkt att. premium dalam html
		cart: [],
		reviews: [
			{
				name: "Jane Doe",
				rating: 4,
				review: "Good quality"
			},
			{
				name: "John Doe",
				rating: 3,
				review: "Doesn't fit"
			}

		]
	},
	methods:{
		updateCart(id){//1
			this.cart.push(id)
		},
		removeCart(id){
			this.cart.pop(id)
		}
	},
	mounted() {
      eventBus.$on('review-submitted', productReview => {
        this.reviews.push(productReview)
      })
    }
})
