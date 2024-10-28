import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from '../../../../auth/services/authentication.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { KTHelpers } from 'src/app/_metronic/kt';
import { LayoutService } from '../../core/layout.service';
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

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss',
  providers: [AsideService],
})
export class AsideComponent implements OnInit, OnDestroy {
  appAngularVersion: string = environment.appVersion;
  tabs: ReadonlyArray<Tab> = [];
  currentUser: any;
  ListMenus: any = {};
  currentHeadMenu: string = '';
  submenuTitle: string = 'Sub Menu';
  filteredSubMenus: any[] = [];
  filteredSubMenus1: any[] = [];
  asideMenuSecondary: boolean = true;
  selectedHeadMenuId: string | null = null;
  hovered: boolean = false;
  isUserInnerVisible = false;
  asideMinimized = false;
  private unsubscribe: Subscription[] = [];
  activeTab: string | null = null;

  constructor(
    private layout: LayoutService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private tabsService: AsideService,
    private auth: AuthenticationService,
    private _router: Router
  ) {
    this.currentUser = localStorage.getItem('currentEmail');
    this.ListMenus = '';
  }

  ngOnInit(): void {
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
}
