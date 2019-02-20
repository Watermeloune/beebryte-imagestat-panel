import { PanelCtrl , MetricsPanelCtrl} from 'grafana/app/plugins/sdk'
import _ from 'lodash';
import './css/style.css'



const imageList: string[] = [
  "tree.png",
  "co2.png"
];
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
  image: any;
  imageUrl: string;
  imageListDir: string;

  panelDefaults = {
    title: "Default Title",
    fontSize: null,
    bgColor: null,
    titleSettings: {
      text: "Sample Text",
      fontSize: "20px",
      fontColor: null
    },
    statSettings: {
      fontSize: "20px",
      fontColor: null,
    }
  };

  constructor($scope, $injector) {

    super($scope, $injector);

    this.imageUrl =  imageList[0];
    this.imageListDir = "./img";

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
    this.image = "https://pbs.twimg.com/profile_images/981286460602179584/_dn_Y8P4_400x400.jpg";

  }

  link(scope, elem) {
    this.events.on('render', () => {
      const $titleContainer = elem.find('.imageStat-title');
      const $statContainer = elem.find('.imageStat-stat');

      $titleContainer.css('font-size', this.panel.titleSettings.fontSize);
      $titleContainer.css('color', this.panel.titleSettings.fontColor);

      $statContainer.css('fontSize', this.panel.statSettings.fontSize);
      $statContainer.css('color', this.panel.statSettings.fontColor);

      console.log("========FONT SIZE========");
      console.log(this.panel.titleSettings.fontSize);
    });
  }
}

export{ImageStatCtrl as PanelCtrl};
