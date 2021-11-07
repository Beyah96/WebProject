<template>
  <div class="Mimi">
    <div class="Didi">
      <md-menu>
        <md-button class="md-icon-button" md-menu-trigger>
          <md-icon class="md-size">menu</md-icon>
        </md-button>
        <md-menu-content>
          <md-menu-item>
            <md-icon class="md-size">home</md-icon>
            <span>Home</span>
          </md-menu-item>
          <md-menu-item>
            <md-icon class="md-size">manage_search</md-icon>
            <span>Recherche</span>
          </md-menu-item>

          <md-menu-item>
            <span class="material-icons">view_list</span>
            <span>Liste des restaurants</span>
          </md-menu-item>
        </md-menu-content>
      </md-menu>
    </div>
    <!-- avec div id= "app" on va pouvoir faire une application web qui va se mettre à jour toute seule -->
    <form @submit.prevent="ajouterRestaurant($event)">
      <label>
        Nom : <input name="name" type="text" required v-model="name" />
      </label>
      <label>
        Cuisine :
        <input name="cuisine" type="text" required v-model="cuisine" />
      </label>
      <label>
        Ville : <input name="borough" type="text" required v-model="borough" />
      </label>
      <button>Ajouter</button>
    </form>
    <h1>Nombre de restaurants : {{ nbRestaurantsTotal }}</h1>
    <p>
      Chercher un restaurant :
      <input
        @input="chercherRestaurant()"
        type="text"
        v-model="nomRestauRecherche"
      />
    </p>
    <p>Nombre de pages total : {{ nbPageTotal }}</p>
    <p>
      Nombre de restaurants par page:
      <input
        @change="getRestaurantsFromServer()"
        type="range"
        min="0"
        max="100"
        v-model="pageSize"
      />{{ pageSize }}
    </p>
    <!-- .length pour l'affichage de la longueur d'une varible js -->
    <md-button
      class="md-raised md-primary"
      :disabled="page === 0"
      @click="pagePrecedente()"
      >Precedent</md-button
    >
    <md-button
      class="md-raised md-accent"
      :disabled="page == nbPageTotal"
      @click="pageSuivante()"
      >Suivant</md-button
    >
    Page courante : {{ page }}
    <md-table
      v-model="restaurants"
      md-sort="name"
      md-sort-order="asc"
      md-card
      class="chichi"
    >
      <!-- On affiche des restaurants dans une table  -->

      <!-- les directives de Vue js " -->
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Nom" md-sort-by="name">{{
          item.name
        }}</md-table-cell>
        <md-table-cell md-label="Cuisine" md-sort-by="cuisine">{{
          item.cuisine
        }}</md-table-cell>
        <md-table-cell md-label="Ville" md-sort-by="borough">{{
          item.borough
        }}</md-table-cell>
        <md-table-cell md-label="Détail"
          ><router-link :to="'/restaurant/' + item._id"
            ><md-button class="md-raised md-primary"
              >Details</md-button
            ></router-link
          ></md-table-cell
        >
        <md-table-cell md-label="Supprimer"
          ><md-button
            class="md-raised md-accent"
            @click="supprimerRestaurant(item)"
            >Supprimer</md-button
          ></md-table-cell
        >
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "ListesDesRestaurants",
  data: function () {
    return {
      restaurants: [],
      name: "",
      cuisine: "",
      borough: "",
      nbRestaurantsTotal: 0,
      page: 0,
      //dernierePage:0,
      pageSize: 10,
      nbPageTotal: 0,
      msg: "",
      nomRestauRecherche: "",
    };
  },
  mounted() {
    console.log("Avant l'affichage");
    this.getRestaurantsFromServer();
  },
  methods: {
    pagePrecedente() {
      if (this.page === 0) return;
      this.page--;
      this.getRestaurantsFromServer();
    },
    pageSuivante() {
      if (this.page === this.dernierePage) return;
      this.page++;
      this.getRestaurantsFromServer();
    },
    getRestaurantsFromServer() {
      let url = "http://localhost:8080/api/restaurants?";
      url += "page=" + this.page;
      url += "&pagesize=" + this.pageSize;
      url += "&name=" + this.nomRestauRecherche;

      fetch(url)
        .then((responseJSON) => {
          //arrow functions, conserve le bon this
          //la reponse est en JSON, on la convertit avec la ligne suivante:
          responseJSON.json().then((resJS) => {
            // Maintenant resJS est un vrai objet JavaScript
            console.log(resJS);
            //afficheReponseGET(res);
            this.restaurants = resJS.data;
            this.nbRestaurantsTotal = resJS.count;
            this.nbPageTotal = Math.round(
              this.nbRestaurantsTotal / this.pageSize
            );
          });
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    chercherRestaurant: _.debounce(function () {
      //this.pageSize= 0;
      //appelé que si on a tapé de touches pendant un certain delais
      this.getRestaurantsFromServer();
      if(this.nbRestaurantsTotal==0) {alert("Aucun restaurant ne correspond à votre recherche") } }, 300),
    supprimerRestaurant(r) {
      let url = "http://localhost:8080/api/restaurants/" + r._id;

      fetch(url, {
        method: "DELETE",
      })
        .then((responseJSON) => {
          responseJSON.json().then((resJS) => {
            // Maintenant res est un vrai objet JavaScript
            //afficheReponsePOST(res);
            console.log(resJS.msg);
            //this.msg = resJS.msg;
            //on rafrachit la vue
            this.getRestaurantsFromServer();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    ajouterRestaurant(event) {
      // Récupération du formulaire. Pas besoin de document.querySelector
      // ou document.getElementById puisque c'est le formulaire qui a généré
      // l'événement
      let form = event.target;

      // Récupération des valeurs des champs du formulaire
      // en prévision d'un envoi multipart en ajax/fetch
      let donneesFormulaire = new FormData(form);

      let url = "http://localhost:8080/api/restaurants?";

      fetch(url, {
        method: "POST",
        body: donneesFormulaire,
      })
        .then((responseJSON) => {
          responseJSON.json().then((resJS) => {
            // Maintenant res est un vrai objet JavaScript
            //afficheReponsePOST(res);
            console.log(resJS.msg);
            this.msg = resJS.msg;
            //on rafrachit la vue
            this.getRestaurantsFromServer();
          });
        })
        .catch((err) => {
          console.log(err);
        });
      this.name = "";
      this.cuisine = "";
      this.borough = "";
    },
    getColor(index) {
      return index % 2 ? "lightBlue" : "pink";
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  width: 75%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  color: rgb(184, 194, 48);
}
.chichi {
  width: 75%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
}
.Mimi {
  width: 75%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
.Didi {
  width: 75%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
}
</style>
