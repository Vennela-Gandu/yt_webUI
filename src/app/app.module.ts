import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentFormComponent } from './components/content-form/content-form.component';
import { ContentResultsComponent } from './components/content-results/content-results.component';
import { HomeComponent } from './home/home.component';
import { YtseoComponent } from './ytseo/ytseo.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SocialmediaComponent } from './socialmedia/socialmedia.component';
import { CompetitoranalysisComponent } from './competitoranalysis/competitoranalysis.component';
import { ContentideasComponent } from './contentideas/contentideas.component';
import { LearninghubComponent } from './learninghub/learninghub.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { TeaserListComponent } from './teaser-list/teaser-list.component';
import { FaqAccordionComponent } from './faq-accordion/faq-accordion.component';
import { ExploreLinksComponent } from './explore-links/explore-links.component';
import { InlineLoaderComponent } from './inline-loader/inline-loader.component';
import { CaptiongeneratorComponent } from './captiongenerator/captiongenerator.component';
import { TrendingmusicfinderComponent } from './trendingmusicfinder/trendingmusicfinder.component';
import { SocialmediabiogeneratorComponent } from './socialmediabiogenerator/socialmediabiogenerator.component';
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

import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { FaqsComponent } from './faqs/faqs.component';
import { LoaderInterceptor } from './services/loader.interceptor';
import { LoaderComponent } from './loader/loader.component';
import { EquipmentDetailComponent } from './equipment-detail/equipment-detail.component';

@NgModule({ declarations: [
  AppComponent,
        ContentFormComponent,
        ContentResultsComponent,
        HomeComponent,
        YtseoComponent,
        HeaderComponent,
        FooterComponent,
        SocialmediaComponent,
        CompetitoranalysisComponent,
        ContentideasComponent,
        LearninghubComponent,
        AnalysisComponent,
        TeaserListComponent,
        FaqAccordionComponent,
        ExploreLinksComponent,
        InlineLoaderComponent,
        CaptiongeneratorComponent,
        TrendingmusicfinderComponent,
        SocialmediabiogeneratorComponent,
        CompetitoranalysisyoutubeComponent,
        CompetitoranalysisinstagramComponent,
        CompetitoranalysislinkedinComponent,
        YoutubecontentsuggestionsComponent,
        InstagramcontentsuggestionsComponent,
        YoutubestrategysuggestionsComponent,
        ShortvideossuggestionsComponent,
        MonetizationComponent,
        EquipmentComponent,
        CommunityComponent,
        YoutubeissuesComponent,
        SocialmediastatsComponent,
        YoutubeanalysisComponent,
        BlogComponent,
        PostDetailComponent,
        RegisterComponent,
        FaqsComponent,
        LoaderComponent,    
  EquipmentDetailComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
    FormsModule],
  providers: [provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
    provideClientHydration(withEventReplay())]
})
export class AppModule { }
