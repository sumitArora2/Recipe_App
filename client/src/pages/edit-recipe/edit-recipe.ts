import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { RecipesService } from '../../services/recipes';
import { Recipe } from '../../models/recipe';


@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage {
  mode='New';
  recipe:Recipe;
  index:number;
 selectOptions=['Easy','Medium','Hard'];
 recipeForm:FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams,private actionSheetCntrl:ActionSheetController,
    private alrtCtrl:AlertController,private toastCtrl:ToastController,
    private recipeService:RecipesService) {
  }
  ngOnInit(){
    this.mode=this.navParams.get('mode');
    if(this.mode=='Edit'){
      this.recipe=this.navParams.get('recipe');
      this.index=this.navParams.get('index');
    }
    this.initializeForm();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditRecipePage');
  }
  onSubmit(){
    const value=this.recipeForm.value;
    let ingredients=[];
    if(value.ingredients.length>0){
      ingredients=value.ingredients.map(name=>{
        return {name:name,amount:1};
      });
    }
    if(this.mode=='Edit'){
      this.recipeService.updateRecipe(this.index,value.title,value.description,value.difficulty,ingredients);  
    }
    else{
      this.recipeService.addRecipe(value.title,value.description,value.difficulty,ingredients);
    }
    
    this.recipeForm.reset();
    this.navCtrl.popToRoot();
  }
  onManageIngredient(){
    const actionSheet=this.actionSheetCntrl.create({
      title:'What do you want?',
      buttons:[
        {
          text:'Add Ingredient',
          handler:()=>{
         this.createNewIngrdientAlert().present();
          }
        },
        {
          text:'Remove All Ingredients',
          role:'destructive',
          handler:()=>{
          const fArray:FormArray=<FormArray>this.recipeForm.get('ingredients');
          const len=fArray.length;
          if(len>0){
            for(let i=len-1;i>=0;i--){
              fArray.removeAt(i);
            }
            const toast=this.toastCtrl.create({
              message:'All Items Removed!',
              duration:1500,
              position:'bottom'
            });
          toast.present();
          }
          }
        },
        {
          text:'Cancel',
          role:'cancel'
        }
      ]
    });
    actionSheet.present();
  }

private createNewIngrdientAlert(){
  return this.alrtCtrl.create({
    title:'Add Ingredient',
    inputs:[
      {
        name:'name',
        placeholder:'Name'
      }
    ],
    buttons:[
      {
        text:'Cancel',
        role:'cancel'
      },
      {
        text:'Add',
        handler:data=>{
          if(data.name.trim()=='' || data.name==null){
            const toast=this.toastCtrl.create({
              message:'Please enter a valid value!',
              duration:1500,
              position:'bottom'
            });
          toast.present();
               return ;
          }
          (<FormArray>this.recipeForm.get('ingredients'))
          .push(new FormControl(data.name,Validators.required));
          const toast=this.toastCtrl.create({
            message:'Item Added!',
            duration:1500,
            position:'bottom'
          });
        toast.present();
        }
      }
    ]
  });
}



private initializeForm(){
  let title=null;
  let description=null;
  let difficulty='Medium';
  let ingredients=[];

  if(this.mode=='Edit'){
    title=this.recipe.title;
    description=this.recipe.description;
    difficulty=this.recipe.difficulty;
    for(let ingredient of this.recipe.ingredients){
      ingredients.push(new FormControl(ingredient.name, Validators.required));
    }
  }
  this.recipeForm=new FormGroup({
    'title':new FormControl(title,Validators.required),
     'description':new FormControl(description,Validators.required),
    'difficulty':new FormControl(difficulty,Validators.required),
    'ingredients':new FormArray(ingredients) 
  });
}
}
