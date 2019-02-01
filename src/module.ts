import { PanelCtrl , MetricsPanelCtrl} from 'grafana/app/plugins/sdk'
import _ from 'lodash';
import './css/style.css'



class TemplatePanel extends MetricsPanelCtrl {
  static templateUrl = "partials/module.html";

  isAnimation: null;

  categories: string[];
  panelDefaults = {
    fontSize: null,
    bgColor: null
  };

  constructor($scope, $injector) {


    this.categories = [
      "./img/image-list/tree.png",
      "./img/image-list/co2.png"
    ];


    super($scope, $injector);
    _.defaultsDeep(this.panel, this.panelDefaults);

    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('render', this.onRender.bind(this));
  }

  onInitEditMode() {
    this.addEditorTab('Options', 'public/plugins/beebryte-template-panel/partials/editor.html');
  }

  onDataReceived(dataList) {
    this.value = dataList[0].datapoints[0][0].toFixed(2);
    this.render();
  }

  onRender() {
    console.log(this.categories)
  }
}

export{TemplatePanel as PanelCtrl};
