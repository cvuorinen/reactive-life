/// <reference path="../typings/angular2/angular2.d.ts" />
import {Component, View, bootstrap} from 'angular2/angular2';

import {GameComponent} from 'game/component';

// Annotation section
@Component({
    selector: 'app'
})
@View({
    template: `
        <game-of-life></game-of-life>`,
    directives: [GameComponent]
})
// Component controller
class AppComponent {}

bootstrap(AppComponent);
