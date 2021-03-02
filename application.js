
Vue.component("modal", {
  template: "#modal-template"
});


function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [day, month, year].join('.');
}

var app4 = new Vue({
  el: '#app-4',
  mounted: function () {
    this.loadSites()
  },
  data: {
    showModal: false,
    currentScreenshot : "",
    ransomSites: [
      { text: 'DopplePaymer', selected: true },
      { text: 'REvil', selected: false },
      { text: 'Conti', selected: false }
    ]
  },
  methods: {
    getImgUrl(index) {
      return this.currentScreenshot;
  },
    changeSite: function (event) {
      var old = this.ransomSites.find(element => element.selected ===true);
     if(old!= undefined) {
       old.selected = false;
     }
      event.selected = true;
      this.currentScreenshot = `https://ransomwatchs3.s3.eu-north-1.amazonaws.com/screenshots/${event.siteid}/${formatDate(event.lastScreenshot)}.png`
      
    },
    loadSites: function() {
      var self=this;
      this.$http.get('https://qc1m8bddrd.execute-api.eu-north-1.amazonaws.com/Production/ransomScraperGetAllSites').then(function(response){
      if(response.status == "200"){
      self.ransomSites = response.body;
      this.changeSite(response.body[0])
      }
    })
  }
  }
})