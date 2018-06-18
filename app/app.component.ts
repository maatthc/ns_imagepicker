import { Component, OnInit } from "@angular/core";
import * as imageSourceModule from  "image-source";
import * as fs from "file-system";
import * as imagepicker from "nativescript-imagepicker";
import {
    getBoolean,
    setBoolean,
    getNumber,
    setNumber,
    getString,
    setString,
    hasKey,
    remove,
    clear
} from "application-settings";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
    styleUrls:['app.component.css'],
})

export class AppComponent implements OnInit { 
    public myImage : any;
    public myImageFileName: string;

    public ngOnInit(){
        this.myImageFileName = "profile.png";
        console.log("App started.");
        let myImageName = "";

        if (myImageName = getString("profileImage")){
            this.myImage= imageSourceModule.fromFile(myImageName);
            // console.log("----------->>>> " + myImageName);
        }
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
            that.myImage = selection.length > 0 ? selection[0] : null;
            // console.dir(selection)
            selection.forEach(function(selected_item) {
                // console.dir(selected_item)
                selected_item.getImageAsync(function(imagesource){
                    // console.debug(imagesource);
                    let folder = fs.knownFolders.documents();
                    let path = fs.path.join(folder.path, that.myImageFileName);
                    const img = imageSourceModule.fromNativeSource(imagesource);
                    let saved = img.saveToFile(path, "png");
                    if(saved){
                        // console.log(path);
                        setString("profileImage", path);
                    }                
                })

            });
        }).catch(function (e) {
            console.log(e);
        });
    }
}
