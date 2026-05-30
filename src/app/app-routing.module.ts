import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { YtseoComponent } from './ytseo/ytseo.component';
import { CompetitoranalysisComponent } from './competitoranalysis/competitoranalysis.component';
import { SocialmediaComponent } from './socialmedia/socialmedia.component';
import { ContentideasComponent } from './contentideas/contentideas.component';
import { LearninghubComponent } from './learninghub/learninghub.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { FaqsComponent } from './faqs/faqs.component';
import { ContactusComponent } from './contactus/contactus.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { CookiepolicyComponent } from './cookiepolicy/cookiepolicy.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { SocialmediabiogeneratorComponent } from './socialmediabiogenerator/socialmediabiogenerator.component';
import { TrendingmusicfinderComponent } from './trendingmusicfinder/trendingmusicfinder.component';
import { CaptiongeneratorComponent } from './captiongenerator/captiongenerator.component';
import { CompetitoranalysisyoutubeComponent } from './competitoranalysisyoutube/competitoranalysisyoutube.component';
import { CompetitoranalysisinstagramComponent } from './competitoranalysisinstagram/competitoranalysisinstagram.component';
import { CompetitoranalysislinkedinComponent } from './competitoranalysislinkedin/competitoranalysislinkedin.component';
import { YoutubecontentsuggestionsComponent } from './youtubecontentsuggestions/youtubecontentsuggestions.component';
import { InstagramcontentsuggestionsComponent } from './instagramcontentsuggestions/instagramcontentsuggestions.component';
import { YoutubestrategysuggestionsComponent } from './youtubestrategysuggestions/youtubestrategysuggestions.component';
import { ShortvideossuggestionsComponent } from './shortvideossuggestions/shortvideossuggestions.component';
import { MonetizationComponent } from './monetization/monetization.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { CommunityComponent } from './community/community.component';
import { YoutubeissuesComponent } from './youtubeissues/youtubeissues.component';
import { SocialmediastatsComponent } from './socialmediastats/socialmediastats.component';
import { YoutubeanalysisComponent } from './youtubeanalysis/youtubeanalysis.component';
import { BlogComponent } from './blog/blog.component';
import { AdminPostComponent } from './admin-post/admin-post.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './Authguard';
import { RegisterComponent } from './register/register.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { AdminFaqComponent } from './admin-faq/admin-faq.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';
import { EquipmentDetailComponent } from './equipment-detail/equipment-detail.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { FaqResolver } from './services/faq.resolver';
import { PostResolver } from './services/post.resolver';
import { BlogListResolver } from './services/blog-list.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { schema: 'home' }
  },
  {
    path: 'youtubeseo',
    component: YtseoComponent
  },
  {
    path: 'socialmedia',
    component: SocialmediaComponent,
    children: [
      {
        path: 'captiongenerator',
        component: CaptiongeneratorComponent
      },

      {
        path: 'trendingmusicfinder',
        component: TrendingmusicfinderComponent
      },
      {
        path: 'socialmediabiogenerator',
        component: SocialmediabiogeneratorComponent
      }
    ]
  },
  {
    path: 'competitoranalysis',
    component: CompetitoranalysisComponent,
    children: [
      {
        path: 'competitoranalysisyoutube',
        component: CompetitoranalysisyoutubeComponent
      },
      {
        path: 'competitoranalysisinstagram',
        component: CompetitoranalysisinstagramComponent
      },
      {
        path: 'competitoranalysislinkedin',
        component: CompetitoranalysislinkedinComponent
      },
    ]
  },
  {
    path: 'contentideas',
    component: ContentideasComponent,
    children: [
      {
        path: 'youtubecontentsuggestions',
        component: YoutubecontentsuggestionsComponent
      },
      {
        path: 'instagramcontentsuggestions',
        component: InstagramcontentsuggestionsComponent
      },
      {
        path: 'youtubestrategysuggestions',
        component: YoutubestrategysuggestionsComponent
      },
      {
        path: 'shortvideossuggestions',
        component: ShortvideossuggestionsComponent
      },
    ]
  },
  {
    path: 'learninghub',
    component: LearninghubComponent,
    children: [
      {
        path: 'monetization',
        component: MonetizationComponent
      },
      {
        path: 'equipment',
        component: EquipmentComponent
      },
      { path: 'equipment-detail/:title/:id', component: EquipmentDetailComponent },
      {
        path: 'community',
        component: CommunityComponent
      },
      {
        path: 'faqs/category/:slug',
        component: FaqsComponent
      },
      {
        path: 'faqs',
        component: FaqsComponent,
        resolve: { faqs: FaqResolver },
        data: { schema: 'faq' }
      },
     
      {
        path: 'youtubeissues',
        component: YoutubeissuesComponent
      },
    ]
  },
  {
    path: 'analysis',
    component: AnalysisComponent,
    children: [
      {
        path: 'socialmediastats',
        component: SocialmediastatsComponent
      },
      {
        path: 'youtubeanalysis',
        component: YoutubeanalysisComponent
      },
    ]
  },
  {
    path: 'contactus',
    component: ContactusComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms-conditions',
    component: TermsConditionsComponent
  },
  {
    path: 'cookiepolicy',
    component: CookiepolicyComponent
  },
  {
    path: 'disclaimer',
    component: DisclaimerComponent
  },
  {
    path: 'aboutus',
    component: AboutusComponent
  },

  {
    path: 'blog',
    component: BlogComponent,
    data: { schema: 'bloglist' },
    resolve: { blogs: BlogListResolver }
  },
  {
    path: 'blog/category/:slug',
    component: BlogComponent,
    resolve: { blogs: BlogListResolver }
  },
  {
    path: 'blog/:title/:id',
    component: PostDetailComponent,
    resolve: { post: PostResolver },
    data: { schema: 'post' }
  },
  // Blog filtered by category (optional, SEO friendly)
  
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',

    children: [
      
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      // Login
      {
        path: 'login',
        component: LoginComponent
      },
      // Admin blog list (edit enabled)
      {
        path: 'blog',
        component: BlogComponent,
        canActivate: [AuthGuard]
      },

      // Admin Dashboard
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },

      // Add new post
      {
        path: 'add-post',
        component: AdminPostComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'blog-list',
        component: BlogListComponent,
        canActivate: [AuthGuard]
      },
      // Edit post
      {
        path: 'edit-post/:id',
        component: AdminPostComponent,
        canActivate: [AuthGuard]
      },
      // Equipment Form
      {
        path: 'equipment-form',
        component: EquipmentFormComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'equipment-list',
        component: EquipmentListComponent,
        canActivate: [AuthGuard]
      },
      { path: 'faq', component: AdminFaqComponent },
      { path: 'faq/:id', component: AdminFaqComponent },
       { path: 'faqs', component: FaqsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
