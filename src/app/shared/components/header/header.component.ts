import { Component, Input, OnInit, inject } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;
  @Input() backButton!: string;
  @Input() isModal!: boolean;
  @Input() showMenu!: boolean;

  utilsSvc = inject(UtilsService);
  menucontroler = inject(MenuController); 

  ngOnInit() {}

  dismissModal(){
    this.utilsSvc.dismissModal();
  }

  openMenu() {
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }

}
