import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingManagerService } from './services/loadingmanager.service';
import { EventManagerService } from './services/eventmanager.service';
import { DataManagerService } from './services/datamanager.service';
import { LogManagerService } from './services/logmanager.service';

@NgModule({
  imports: [CommonModule],
  providers: [LogManagerService, EventManagerService, LoadingManagerService, DataManagerService]
})
export class SharedLibModule {
  public static forRoot(environment: any): ModuleWithProviders<SharedLibModule> {
    return {
        ngModule: SharedLibModule,
        providers: [
          LoadingManagerService,
            {
                provide: 'environment', // you can also use InjectionToken
                useValue: environment
            }
        ]
    };
  }
}
