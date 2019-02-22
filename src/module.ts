import { PanelCtrl , MetricsPanelCtrl} from 'grafana/app/plugins/sdk'
import _ from 'lodash';
import './css/style.css'


const imageUrls =  {
  tree: "https://image.noelshack.com/fichiers/2019/08/4/1550767040-tree.png",
  co2: "https://image.noelshack.com/fichiers/2019/08/4/1550767040-co2.png"
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



  value: number;
  isAnimation: null;

  panelDefaults = {
    title: "Default Title",
    bgColor: null,
    titleSettings: {
      text: "Sample Text",
      fontSize: "20px",
      fontColor: null,
      fontWeight: 400
    },
    statSettings: {
      fontSize: "20px",
      fontColor: null,
      fontWeight: 400,
      suffix: "%",
    },
    imageSettings: {
      imageUrl: null,
      image: null

    }
  };

  constructor($scope, $injector) {

    super($scope, $injector);

    _.defaultsDeep(this.panel, this.panelDefaults);

    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('render', this.onRender.bind(this));
  }

  onInitEditMode() {
    this.addEditorTab('Options', 'public/plugins/beebryte-imagestat-panel/partials/editor.html');
  }

  onDataReceived(dataList) {
    this.value = dataList[0].datapoints[0][0].toFixed(0);
    this.render();


  }

  onRender() {
    this.panel.imageSettings.imageUrl = imageUrls[this.panel.imageSettings.image];
    console.log(this.panel.imageSettings.imageList) ;

  }

  link(scope, elem) {
    this.events.on('render', () => {
      const $titleContainer = elem.find('.imageStat-title');
      const $statContainer = elem.find('.imageStat-stat');

      $titleContainer.css('font-size', this.panel.titleSettings.fontSize);
      $titleContainer.css('color', this.panel.titleSettings.fontColor);
      $titleContainer.css('font-weight', this.panel.titleSettings.fontWeight);

      $statContainer.css('fontSize', this.panel.statSettings.fontSize);
      $statContainer.css('color', this.panel.statSettings.fontColor);
      $statContainer.css('font-weight', this.panel.statSettings.fontWeight);

    });
  }
}

export{ImageStatCtrl as PanelCtrl};
