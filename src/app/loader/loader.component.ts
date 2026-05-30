import { Component } from '@angular/core';
import { LoaderService } from '../services/loader.service';


@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  standalone:false
})
export class LoaderComponent {
  loading$ = this.loader.loading$;

  constructor(private loader: LoaderService) {}
}
