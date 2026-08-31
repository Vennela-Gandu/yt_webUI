import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AdminRoutingModule } from './admin-routing.module';

import { LoginComponent } from '../login/login.component';
import { AdminPostComponent } from '../admin-post/admin-post.component';
import { AdminFaqComponent } from '../admin-faq/admin-faq.component';
import { AdminAuthorComponent } from '../admin-author/admin-author.component';
import { AdminAuthorListComponent } from '../admin-author-list/admin-author-list.component';
import { BlogListComponent } from '../blog-list/blog-list.component';
import { FaqListComponent } from '../faq-list/faq-list.component';
import { EquipmentFormComponent } from '../equipment-form/equipment-form.component';
import { EquipmentListComponent } from '../equipment-list/equipment-list.component';

/**
 * Everything behind /admin, loaded only when an admin navigates there.
 *
 * These screens were ~62 KB of the main bundle that every visitor downloaded
 * and none of them could use. The CKEditor Angular wrapper lives here too, for
 * the same reason — only the three editor screens need it.
 *
 * DashboardComponent is a standalone component, so it is routed directly by
 * admin-routing rather than declared here.
 */
@NgModule({
  declarations: [
    LoginComponent,
    AdminPostComponent,
    AdminFaqComponent,
    AdminAuthorComponent,
    AdminAuthorListComponent,
    BlogListComponent,
    FaqListComponent,
    EquipmentFormComponent,
    EquipmentListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CKEditorModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
