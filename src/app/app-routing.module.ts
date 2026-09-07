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
import { AuthGuard } from './Authguard';
import { RegisterComponent } from './register/register.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { EquipmentDetailComponent } from './equipment-detail/equipment-detail.component';
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
        path: 'community',
        component: CommunityComponent
      },
      {
        // Each FAQ category is its own indexable page: resolved server-side so
        // the HTML carries that category's questions and their JSON-LD.
        // /learninghub/faqs/<category>. One segment, so it cannot be
        // confused with the unfiltered /learninghub/faqs above.
        path: 'faqs/:slug',
        component: FaqsComponent,
        resolve: { faqs: FaqResolver },
        data: { schema: 'faq' }
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
    path: 'equipment',
    component: EquipmentComponent,
    // 'full' so /equipment/<category> reaches the route below instead of
    // matching here with an unconsumed segment.
    pathMatch: 'full'
  },
  {
    // One equipment category, e.g. /equipment/dslr-mirrorless-cameras.
    // Same component: the slug just narrows what it lists.
    path: 'equipment/:category',
    component: EquipmentComponent
  },
  {
    // Everyone who writes for the site.
    path: 'author',
    loadComponent: () => import('./author-index/author-index.component').then(m => m.AuthorIndexComponent)
  },
  {
    // One author: profile plus everything they published. Linked from the
    // byline on the blog list, a post, and an equipment guide.
    path: 'author/:name',
    loadComponent: () => import('./author/author.component').then(m => m.AuthorComponent)
  },
  {
    path: 'equipment-detail/:title',
    component: EquipmentDetailComponent
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
    loadComponent: () => import('./contactus/contactus.component').then(m => m.ContactusComponent)
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
  },
  {
    path: 'terms-conditions',
    loadComponent: () => import('./terms-conditions/terms-conditions.component').then(m => m.TermsConditionsComponent)
  },
  {
    path: 'cookiepolicy',
    loadComponent: () => import('./cookiepolicy/cookiepolicy.component').then(m => m.CookiepolicyComponent)
  },
  {
    path: 'disclaimer',
    loadComponent: () => import('./disclaimer/disclaimer.component').then(m => m.DisclaimerComponent)
  },
  {
    path: 'aboutus',
    loadComponent: () => import('./aboutus/aboutus.component').then(m => m.AboutusComponent)
  },
  {
    // Linked from the block at the foot of About Us, and nested under it.
    // A sibling path rather than a child route: About Us has no router-outlet,
    // and this page replaces it rather than rendering inside it.
    path: 'aboutus/editorial-policy',
    loadComponent: () => import('./editorial-policy/editorial-policy.component').then(m => m.EditorialPolicyComponent)
  },

  {
    path: 'blog',
    component: BlogComponent,
    data: { schema: 'bloglist' },
    resolve: { blogs: BlogListResolver }
  },
  {
    // /blog/<category>. A post is /blog/<title>/<id>, one segment longer,
    // so the two never match the same URL.
    path: 'blog/:slug',
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
      // These two reuse the PUBLIC components (AppModule declares them), so
      // they stay eager. BlogComponent shows edit buttons when the URL starts
      // with /admin.
      {
        path: 'blog',
        component: BlogComponent,
        canActivate: [AuthGuard]
      },
      { path: 'faqs', component: FaqsComponent },

      // The equipment page with edit buttons, the counterpart of /admin/blog.
      // pathMatch 'full' so it cannot swallow /admin/equipment-form or
      // /admin/equipment-list, which live in the lazy admin module.
      {
        path: 'equipment',
        component: EquipmentComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
      },

      // Everything else behind /admin is loaded on demand — ~62 KB of screens
      // no visitor can use. Paths are unchanged; see admin-routing.module.ts.
      {
        path: '',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // Every navigation lands at the top of the new page rather than keeping
      // the scroll offset of the page being left.
      scrollPositionRestoration: 'top'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
