<template>
  <div class="chichi">
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-card>
          <md-card-media>
            <img class="photos" v-if="selected" :src="selected" alt="" />
          </md-card-media>
          <md-card-content>
            <h2 class="md-title">Cuisine: {{ restaurant.cuisine }}</h2>
             <md-divider></md-divider>
            <h2 class="md-title">Ville: {{ restaurant.borough }}</h2>
          </md-card-content>
        </md-card>
      </div>

      <div class="md-layout-item md-size-70">
        <md-card>
          <md-card-header>
            <div class="md-title">
              <h1>{{ restaurant.name }}</h1>
            </div>
          </md-card-header>
          <md-card-content>
           <GmapMap
          :center="{
            lat: restaurant.address.coord[0],
            lng: restaurant.address.coord[1],
          }"
          :zoom="2"
          map-type-id="terrain"
          :style="gmapstyle"
        >
          <GmapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            :clickable="true"
            :draggable="false"
            @click="center = m.position"
          />
        </GmapMap>
          </md-card-content>
        </md-card>
        
      </div>
    </div>
  </div>
</template>

<script>
var photos = [
  "https://snm-nl-contentmedia.s3-eu-west-1.amazonaws.com/cookloveshare-wordpress/app/uploads/2018/01/10171030/quelles-sont-les-5-choses-les-plus-sales-dans-un-restaurant.jpg",
  "https://static-otelico.com/cache/montmartre_apolonia/hotel_paris_montmartre_resto.jpg",
  "https://cdn.pixabay.com/photo/2016/02/10/13/35/hotel-1191718_960_720.jpg ",
  "https://cdn.pixabay.com/photo/2017/07/21/16/43/restaurant-2526238_960_720.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3AjwohyEFrXfHXrBtEQL9gXq9pWgeGSJaESmPK7vzudG8zKMoVdv2Og_Mbb9zR0wixQ8&usqp=CAU",
  "https://www.publicdomainpictures.net/pictures/200000/nahled/restaurant-14744452374ck.jpg",
];
export default {
  gmapstyle: "",
  name: "Restaurant",
  props: {},

  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  data: function () {
    return {
      gmapstyle: "width: 100%; height: " + screen.height + "px",
      restaurant: null,
      markers: [],
      photos: photos,
      selected: null,
    };
  },
  mounted() {
    console.log("Avant l'affichage, on pourra faire un fech");
    console.log("ID=" + this.id);
    let url = "http://localhost:8080/api/restaurants/" + this.id;
    fetch(url)
      .then((reponse) => {
        return reponse.json();
      })
      .then((data) => {
        console.log(data.restaurant.name);
        this.restaurant = data.restaurant;
        this.markers = [
          {
            position: {
              lat: data.restaurant.address.coord[0],
              lng: data.restaurant.address.coord[1],
            },
          },
        ];
      });
  },
  methods: {
    randomPhoto(imgs) {
      return imgs[Math.floor(Math.random() * photos.length)];
    },
  },
  created() {
    this.selected = this.randomPhoto(this.photos);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
small {
  display: block;
}
h1,
h2,
h3 {
  color: rgb(184, 194, 48);

  margin-left: auto;
  margin-right: auto;
}

.chichi{
  margin: 1%;
}

.photos {
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  display: center;
}
</style>
