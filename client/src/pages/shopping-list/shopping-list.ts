import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { ShoppingListService } from './../../services/shopping-list';
import { Ingredient } from './../../models/ingedient';

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
  listItems:Ingredient[]
  constructor(public navCtrl: NavController, public navParams: NavParams,public slService:ShoppingListService) {
  }
ionViewWillEnter(){
  this.loadItems();
}
  onAddItem(form:NgForm){
    this.slService.addItem(form.value.ingredientName,form.value.amount);
    form.reset();
    this.loadItems();
  }
 private loadItems(){
    this.listItems=this.slService.getItems();
  }

  onCheckItem(index:number){
this.slService.removeItems(index);
this.loadItems();
  }
}
