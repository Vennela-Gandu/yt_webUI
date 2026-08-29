import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../Authguard';
import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AdminPostComponent } from '../admin-post/admin-post.component';
import { AdminFaqComponent } from '../admin-faq/admin-faq.component';
import { AdminAuthorComponent } from '../admin-author/admin-author.component';
import { AdminAuthorListComponent } from '../admin-author-list/admin-author-list.component';
import { BlogListComponent } from '../blog-list/blog-list.component';
import { EquipmentFormComponent } from '../equipment-form/equipment-form.component';
import { EquipmentListComponent } from '../equipment-list/equipment-list.component';

/**
 * Admin routes. Mounted under /admin by the lazy loadChildren in
 * app-routing.module.ts, so every path here is relative to /admin — the URLs
 * are exactly what they were before this module existed.
 *
 * /admin/blog and /admin/faqs stay in the eager routing: they reuse the public
 * BlogComponent and FaqsComponent, which AppModule declares.
 */
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // Blog posts
  { path: 'add-post', component: AdminPostComponent, canActivate: [AuthGuard] },
  { path: 'edit-post/:id', component: AdminPostComponent, canActivate: [AuthGuard] },
  { path: 'blog-list', component: BlogListComponent, canActivate: [AuthGuard] },

  // Equipment
  { path: 'equipment-form', component: EquipmentFormComponent, canActivate: [AuthGuard] },
  { path: 'equipment-form/:id', component: EquipmentFormComponent, canActivate: [AuthGuard] },
  { path: 'equipment-list', component: EquipmentListComponent, canActivate: [AuthGuard] },

  // Authors — saving one creates its public page
  { path: 'author-form', component: AdminAuthorComponent, canActivate: [AuthGuard] },
  { path: 'author-form/:id', component: AdminAuthorComponent, canActivate: [AuthGuard] },
  { path: 'author-list', component: AdminAuthorListComponent, canActivate: [AuthGuard] },

  // FAQs
  { path: 'faq', component: AdminFaqComponent },
  { path: 'faq/:id', component: AdminFaqComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
