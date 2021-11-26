
function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

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

function scrollToImage(){
  var ua = navigator.userAgent;
  var isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(ua);

  if (isMobile) {
    var elmnt = document.getElementById("imgcontainer");
    elmnt.scrollIntoView();
  }
}

var app4 = new Vue({
  el: '#app-4',
  mounted: function () {
    this.loadSites()
  },
  data: {
    imageLoading: false,
    view: 1,
    selectedSite : {},
    submitSiteUrl: "",
    submitSiteUrlResponse: "",
    ransomSites: [
    ]
  },
  methods: { 
    ImgLoaded() {
    console.log("img loaded");
    this.imageLoading = false;
},
    formatTime: function(index) {
      return timeSince(new Date(index));
  },
    changeSite: function (event) {
      this.view=1;
      if(event.lastScreenshot == "") return;
      var old = this.ransomSites.find(element => element.selected ===true);
     if(old!= undefined) {
       old.selected = false;
     }
     this.imageLoading = true;
      event.selected = true;
      event.screenshot = `https://ransomwatchs3.s3.eu-north-1.amazonaws.com/screenshots/${event.siteid}/${formatDate(event.lastScreenshot)}.png`
      this.selectedSite = event;
      scrollToImage();
    },
    getSiteCrawlPreview: function (_siteUrl) {
      console.log(`getSiteCrawlPreview called with input ${_siteUrl}`);
      var self = this;
      this.imageLoading = true;
      axios.post('https://qc1m8bddrd.execute-api.eu-north-1.amazonaws.com/Production/ransomWatchPreviewSite', {
        siteUrl: _siteUrl
      }).then(function (response) {
        self.imageLoading = false;
        if (response.status == "200") {
          console.log(response);
          self.submitSiteUrlResponse = response.data.Message;
        }
      })
    },
    submitSite: function (_siteUrl) {
      console.log(`submitSite called with input ${_siteUrl}`);
      var self = this;
      this.imageLoading = true;
      axios.post('https://qc1m8bddrd.execute-api.eu-north-1.amazonaws.com/Production/ransomWatchSubmitNewSite', {
        siteUrl: _siteUrl
      }).then(function (response) {
        self.imageLoading = false;
        if (response.status == "200") {
          console.log(response);
          self.submitSiteUrlResponse = response.data.Message;
        }
      })
    },
    loadSites: function() {
      var self=this;
      axios.get('https://qc1m8bddrd.execute-api.eu-north-1.amazonaws.com/Production/ransomScraperGetAllSites')
      .then(function (response) {
        if(response.status == "200"){
          self.ransomSites = response.data.filter(x=> x.lastScreenshot !== "").sort(function(a, b) {
            var c = new Date(a.lastScreenshot);
            var d = new Date(b.lastScreenshot);
            return d-c;
        });
        self.changeSite(response.data[0])
          }
      });

  }
  }
})