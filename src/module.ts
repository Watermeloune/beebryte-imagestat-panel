import { PanelCtrl , MetricsPanelCtrl} from 'grafana/app/plugins/sdk'
import _ from 'lodash';
import './css/style.css'
import { notStrictEqual } from 'assert';
import img from './img/beebryte_icon.png';


var context = require.context('./img', true, /.*/);
var files={};
let imagesList : string[] = []
context.keys().forEach((filename)=>{
  imagesList.push(filename.substring(2, filename.length-4));
  files[filename.substring(2, filename.length-4)] = context(filename);
});
console.log(files);
console.log(imagesList);

const imageUrls =  {
  tree: "https://image.noelshack.com/fichiers/2019/08/4/1550767040-tree.png",
  co2: "https://image.noelshack.com/fichiers/2019/08/4/1550767040-co2.png",
  down: "https://image.noelshack.com/fichiers/2019/09/5/1551436070-downarrow.png",
  up: "https://image.noelshack.com/fichiers/2019/09/5/1551436070-uparrow.png"
};

/*
  #ffda44
  #ffc43b
  #ffc212
  #ff7e25
  #ff5023
  #ff4a39po
*/

class ImageStatCtrl extends MetricsPanelCtrl {
  static templateUrl = "partials/module.html";

  rawData: number[];
  value: number;

  //If comparison or ratio: today is the value for today ---- notToday is the value you wanna compare to
  today: number;
  notToday: number;
  imageList : string[];

  panelDefaults = {
    mode: "value",
    title: "Default Title",
    bgColor: null,
    titleSettings: {
      text: "Sample Text",
      fontSize: "20px",
      fontColor: null,
      fontWeight: 400
    },
    statSettings: {
      decimalNumber: "2",
      divider: "1",
      fontSize: "20px",
      fontColor: null,
      fontWeight: 400,
      suffix: "%",
      inferiorToZero : true,
    },
    imageSettings: {
      imageUrl: null,
      image: "beebryte_icon",
      upColor: "green",
      downColor: "red",
    },
  };

  constructor($scope, $injector) {

    super($scope, $injector);

    this.imageList = imagesList;
    _.defaultsDeep(this.panel, this.panelDefaults);

    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('render', this.onRender.bind(this));
  }

  onInitEditMode() {
    this.addEditorTab('Options', 'public/plugins/beebryte-imagestat-panel/partials/editor.html');
  }

  onDataReceived(panelData) {
    
    this.rawData = panelData[0];
    console.log(this.rawData);
    this.render()
  }

  onRender() {

    if (this.value < 0 && !this.panel.statSettings.inferiorToZero) {
      this.value = 0;
    }

    if (this.panel.mode === "ratio"){
      this.notToday = this.rawData.datapoints[this.rawData.datapoints.length-2][0].toFixed(0);
      this.today = this.rawData.datapoints[this.rawData.datapoints.length-1][0].toFixed(0);
      this.value = (100 - (this.today / this.notToday * 100)).toFixed(1);
      if (this.today < this.notToday) {
        this.value = this.value * -1;
      }
      if (this.value >= 0) {
        this.panel.imageSettings.imageUrl = files["up"];
      } else {
        this.panel.imageSettings.imageUrl = files["down"]
      }
      
    } else if (this.panel.mode === "comparison") {
      this.notToday = this.rawData.datapoints[this.rawData.datapoints.length-2][0].toFixed(0);
      this.today = this.rawData.datapoints[this.rawData.datapoints.length-1][0].toFixed(0);
      this.value = this.notToday - this.today;

      this.panel.imageSettings.imageUrl = files[this.panel.imageSettings.image];
    } else {
      this.value = this.rawData.datapoints[this.rawData.datapoints.length-1][0].toFixed(0);
      
      this.panel.imageSettings.imageUrl = files[this.panel.imageSettings.image];
    }
    

  }

  link(scope, elem) {
    this.events.on('render', () => {
      const $titleContainer = elem.find('.imageStat-title');
      const $statContainer = elem.find('.imageStat-stat');
      const $image = elem.find('.imageDisplayed img');

      $titleContainer.css('font-size', this.panel.titleSettings.fontSize);
      $titleContainer.css('color', this.panel.titleSettings.fontColor);
      $titleContainer.css('font-weight', this.panel.titleSettings.fontWeight);

      $statContainer.css('fontSize', this.panel.statSettings.fontSize);
      $statContainer.css('color', this.panel.statSettings.fontColor);
      $statContainer.css('font-weight', this.panel.statSettings.fontWeight);

      

      if (this.panel.mode === "ratio") {
        
        if (this.value >= 0) {
          $image.css('background', this.panel.imageSettings.upColor);
        } else {
          $image.css('background', this.panel.imageSettings.downColor);
        }
      } else {
        //$image.css("content", "url("+img+")";
      }
  

    });
  }
}

export{ImageStatCtrl as PanelCtrl};
