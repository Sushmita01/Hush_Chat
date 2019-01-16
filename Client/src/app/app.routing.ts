import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/compiler/src/core";
import {ChatroomComponent} from './chatroom/chatroom.component'
const routes: Routes = [
    {path: '', component: ChatroomComponent}, 
    {path: '**',  component: ChatroomComponent}
 ];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(routes);