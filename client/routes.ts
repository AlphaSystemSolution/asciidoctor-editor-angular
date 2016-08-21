import { Routes, RouterModule } from '@angular/router';

import { EmptyComponent } from './components/shared/empty.component';

export const routes: Routes = [
    { path: '', component: EmptyComponent }
];

export const routing = RouterModule.forRoot(routes, { useHash: true });