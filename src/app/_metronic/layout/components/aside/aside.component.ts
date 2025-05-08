import {
  ViewChild,
  ElementRef,
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from '../../../../auth/services/authentication.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { KTHelpers } from 'src/app/_metronic/kt';
import { LayoutService } from '../../core/layout.service';
import { baseUrl, checkUrl, baseUrlLuar } from 'src/app/pages/baseurl';
import { AsideService } from './aside.service';

export type Tab = {
  link: string;
  icon: string;
  tooltip: string;
  MenuId: string;
  DropdownMenu: string;
  hovered?: boolean;
  clicked?: boolean;
};

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss',
  providers: [AsideService],
})
export class AsideComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;
  appAngularVersion: string = environment.appVersion;
  tabs: ReadonlyArray<Tab> = [];
  currentUser: any;
  ListMenus: any = {};
  currentHeadMenu: string = '';
  submenuTitle: string = 'Sakura AI';
  filteredSubMenus: any[] = [];
  filteredSubMenus1: any[] = [];
  asideMenuSecondary: boolean = true;
  selectedHeadMenuId: string | null = null;
  hovered: boolean = false;
  isUserInnerVisible = false;
  asideMinimized = false;
  private unsubscribe: Subscription[] = [];
  activeTab: string | null = null;
  currentRegister: any;
  messages: { sender: 'user' | 'bot'; text: string }[] = [];
  botName: string = 'Sakura AI';
  userName: string = 'You';
  prompt: string = '';
  response: string = '';
  error: string = '';
  isLoading: boolean = false;
  currentUserName: any;

  constructor(
    private layout: LayoutService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private tabsService: AsideService,
    private auth: AuthenticationService,
    private _router: Router
  ) {
    this.currentUser = localStorage.getItem('currentEmail');
    this.currentRegister = localStorage.getItem('currentRegister');
    this.currentUserName = localStorage.getItem('currentUserName');
    this.ListMenus = '';
  }

  ngOnInit(): void {
    this.showImage(this.currentRegister);
    this.asideMenuSecondary = this.layout.getProp(
      'aside.secondaryDisplay'
    ) as boolean;

    const storedMenuId = localStorage.getItem('selectedHeadMenuId');
    const storedSubmenuTitle = localStorage.getItem('submenuTitle');
    const storedTabs = localStorage.getItem('tabs');
    const storedListMenus = localStorage.getItem('ListMenus');

    if (storedTabs) {
      this.tabs = JSON.parse(storedTabs);
    } else {
      this.loadMenu();
    }

    if (storedListMenus) {
      this.ListMenus = JSON.parse(storedListMenus);
    } else {
      this.loadSubMenu();
    }

    if (storedMenuId && storedSubmenuTitle) {
      this.selectedHeadMenuId = storedMenuId;
      this.submenuTitle = storedSubmenuTitle;
      this.filterSubMenus();
      this.filterSubMenus1();
    }

    this.routingChanges();
    this.currentUserName = localStorage.getItem('currentUserName');
    this.userName = this.currentUserName || 'You';
    this.botName = 'Sakura AI';
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  routingChanges() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        KTHelpers.menuReinitialization();

        const storedTabs = localStorage.getItem('tabs');
        const storedListMenus = localStorage.getItem('ListMenus');

        if (storedTabs) {
          this.tabs = JSON.parse(storedTabs);
        } else {
          this.loadMenu();
        }

        const storedMenuId = localStorage.getItem('selectedHeadMenuId');
        const storedSubmenuTitle = localStorage.getItem('submenuTitle');

        if (storedMenuId && storedSubmenuTitle) {
          this.selectedHeadMenuId = storedMenuId;
          this.submenuTitle = storedSubmenuTitle;
          this.filterSubMenus();
          this.filterSubMenus1();
        }
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  toggleUserInner() {
    this.isUserInnerVisible = !this.isUserInnerVisible;
  }

  toggleAside() {
    this.asideMinimized = !this.asideMinimized;
    if (this.asideMinimized) {
      this.isUserInnerVisible = false;
    }
  }

  loadMenu(): void {
    this.tabsService
      .getListMenu('4', 'menu_css', 'Menu', this.currentUser)
      .subscribe((data) => {
        this.tabs = this.transformDataToTabs(data);
        localStorage.setItem('tabs', JSON.stringify(this.tabs));
      });
  }

  loadSubMenu(): void {
    this.tabsService
      .getListMenu('4', 'menu_css', 'SubMenu', this.currentUser)
      .subscribe((data) => {
        if (data) {
          this.ListMenus = data;
          localStorage.setItem('ListMenus', JSON.stringify(this.ListMenus));
        } else {
          console.error('No data received');
        }
      });
  }

  transformDataToTabs(data: any): ReadonlyArray<Tab> {
    return data.map((item: any) => ({
      link: item.Page,
      icon: item.Icon,
      tooltip: item.MenuName,
      MenuId: item.MenuId,
      DropdownMenu: item.DropdownMenu,
    }));
  }

  setHeadMenu(menuId: string, title: string): void {
    this.selectedHeadMenuId = menuId;
    this.submenuTitle = title;
    localStorage.setItem('selectedHeadMenuId', menuId);
    localStorage.setItem('submenuTitle', title);
    this.asideMinimized = false;
    document.body.setAttribute('data-kt-aside-minimize', 'off');
    this.filterSubMenus();
    this.filterSubMenus1();

    const selectedTab = this.tabs.find((tab) => tab.MenuId === menuId);
    if (selectedTab && selectedTab.DropdownMenu === 'FALSE') {
      this.router.navigate([selectedTab.link]);
    }
  }

  isSameMenu(menuId: string): boolean {
    console.log(
      'Checking if menuId matches selectedHeadMenuId',
      menuId,
      this.selectedHeadMenuId
    );
    return this.selectedHeadMenuId === menuId;
  }

  filterSubMenus(): void {
    this.filteredSubMenus = this.ListMenus.filter(
      (menu: any) => menu.HeadMenu === this.selectedHeadMenuId
    );
  }

  filterSubMenus1(): void {
    this.filteredSubMenus1 = this.ListMenus.filter(
      (menu: any) => menu.HeadMenu
    );
  }

  isSubMenuActive(subMenu: any): boolean {
    return this.router.isActive(subMenu.link, false);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  profile() {
    this._router.navigate(['/profile']);
  }

  logout() {
    this.auth.logout();
    this._router.navigate(['/login']);
    document.location.reload();
  }

  showImage(imageId: any) {
    if (!imageId) {
      console.error('ID gambar tidak valid:', imageId);
      return;
    }

    let url;
    if (checkUrl()) {
      url = baseUrl + 'Auth/GetFotoProfile/' + imageId;
    } else {
      url = baseUrlLuar + 'Auth/GetFotoProfile/' + imageId;
    }

    console.log('Mengambil gambar dari:', url);

    $('#FotoProfile').empty();

    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      success: function (response) {
        if (response.success) {
          const imageUrl = 'data:image/jpeg;base64,' + response.data;
          const imageHTML = `<img src="${imageUrl}" alt="${imageId}" class="profile-image"/>`;

          $('#FotoProfile').append($(imageHTML));
        } else {
          console.error('Gagal memuat gambar:', response.error);
        }
      },
      error: function (xhr, status, error) {
        console.error('AJAX error:', error);
      },
    });

    console.log('ditampilkan');
  }

  sendMessage(): void {
    if (this.prompt.trim() !== '') {
      const userMessage: Message = { sender: 'user', text: this.prompt };
      this.messages.push(userMessage);
      this.generateResponse(this.prompt);
      this.prompt = ''; // Clear input
    }
  }

  generateResponse(prompt: string): void {
    this.isLoading = true;

    this.tabsService.generateText(prompt).subscribe(
      (data) => {
        const botText = data?.response ?? 'Tidak ada respon dari server.';
        const botMessage: Message = { sender: 'bot', text: botText };
        this.messages.push(botMessage);
        this.isLoading = false;
      },
      (error) => {
        this.error =
          error?.error?.error ||
          'Terjadi kesalahan saat berkomunikasi dengan Sakura AI.';
        const errorMessage: Message = { sender: 'bot', text: this.error };
        this.messages.push(errorMessage);
        this.isLoading = false;
      }
    );
  }

  scrollToBottom(): void {
    try {
      this.chatScrollContainer.nativeElement.scrollTop =
        this.chatScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error', err);
    }
  }
}
