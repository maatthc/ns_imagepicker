import { Component, OnInit } from "@angular/core";
import * as imageSourceModule from  "image-source";
import * as fs from "file-system";
import * as imagepicker from "nativescript-imagepicker";
import {
    getString,
    setString,
} from "application-settings";
import {Settings} from "./settings";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
    styleUrls:['app.component.css'],
})

export class AppComponent implements OnInit { 
    public profileImage : any;
    private _settings: Settings;

    public ngOnInit(){
        console.log("App started.");
        this.loadSettings();
    }

    private loadSettings(){
        let mySettings :string = "";
        let myImageName = "";
        if (mySettings = getString("settings")){
            console.log("There is already a existing settings..")
            this._settings = JSON.parse(mySettings);
            if (this._settings.profileImageFileName != ""){
                this.profileImage = imageSourceModule.fromFile(this._settings.profileImageFileName);
            }
        } else {
            this._settings = {
                name: "You name",
                dateBirth: 0,
                email: "your@email",
                sex: "",
                loyalty: 0,
                phone: 0,
                profileImageFileName: "profile.png",
            };
        }
        console.dir(JSON.stringify(this._settings));
    }

    get settings(): Settings {
        return this._settings;
    }

    private saveChangesSettings(){
        return;
    }

    getPicture(){
        // var milliseconds = (new Date).getTime();
        var that = this;
        let context = imagepicker.create({
            mode: "single"
        });
        context.authorize().then(()=>{
            return context.present();
        })
        .then(function(selection) {
            that.profileImage = selection.length > 0 ? selection[0] : null;
            // console.dir(that.profileImage);
            selection.forEach(function(selected_item) {
                // console.dir(selected_item)
                selected_item.getImageAsync(function(imagesource){
                    console.log(imagesource);
                    let folder = fs.knownFolders.documents();
                    let path = fs.path.join(folder.path, that._settings.profileImageFileName);
                    const img = imageSourceModule.fromNativeSource(imagesource);
                    console.debug(img);
                    let saved = img.saveToFile(path, "png");
                    if(saved){
                        // console.log(path);
                        setString("settings", JSON.stringify(that._settings));
                    }                
                })
            });
        }).catch(function (e) {
            console.log(e);
        });
    }
}
