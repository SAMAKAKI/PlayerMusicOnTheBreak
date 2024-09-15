// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{api::{dialog::message}, Window};
use std::{fs, path::{Path, PathBuf}};

#[tauri::command]
async fn saveMusic(window: Window, folderPath: String, fileName: String, fileContent: Vec<u8>) -> Result<String, String> {
  let path: &Path = Path::new(&folderPath);

  if !path.exists(){
    if let Err(e) = fs::create_dir_all(path){
      let errorMessage: String = String::from(format!("Error in creating directory: {}", e));
      message(Some(&window), "Error", &errorMessage);
      return Err(errorMessage);
    }
  }

  if !fileName.ends_with(".mp3"){
    let errorMessage: String = String::from("Bad extension of file");
    message(Some(&window), "Error", &errorMessage);
    return Err(errorMessage);
  }

  let filePath: PathBuf = path.join(fileName);
  if let Err(e) = fs::write(filePath, fileContent){
    let errorMessage: String = String::from(format!("Error saving file: {}", e));
    message(Some(&window), "Error", &errorMessage);
    return Err(errorMessage);
  }

  Ok("File has been save successfully".into())
}

#[tauri::command]
async fn removeMusic(filePath: String) -> Result<(), String> {
  let path: &Path = Path::new(&filePath);

  if !path.exists(){
    return Err("Error path does not exist".into())
  }

  if let Err(e) = fs::remove_file(path){
    return Err(format!("Error removing file: {}", e))
  }

  Ok(())
}

#[tauri::command]
async fn listMusic(window: Window, folderPath: String) -> Result<Vec<String>, String> {
  let path: &Path = Path::new(&folderPath);

  if !path.exists(){
    let errorMessage: String = String::from("Folder does not exist");
    message(Some(&window), "Error", &errorMessage);
    return Err(errorMessage);
  }

  let mut fileList: Vec<String> = Vec::new();
  match fs::read_dir(path) {
    Ok(entries) => {
      for entry in entries {
        match entry {
          Ok(entry) => {
            let fileName = entry.file_name();
            if let Some(fileNameStr) = fileName.to_str(){
              if fileNameStr.ends_with(".mp3") {
                let filePath = PathBuf::from(&folderPath).join(fileNameStr);
                if let Some(filePathStr) = filePath.to_str(){
                  fileList.push(filePathStr.to_string());
                }
              }
            }
          }
          Err(e) => {
            let errorMessage: String = String::from(format!("Error reading file in directory: {}", e));
            message(Some(&window), "Error", &errorMessage);
            return Err(errorMessage);
          }
        }
      }
    }
    Err(e) => {
      let errorMessage: String = String::from(format!("Error reading directory: {}", e));
      message(Some(&window), "Error", &errorMessage);
      return Err(errorMessage);
    }
  }

  Ok(fileList)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![saveMusic, listMusic, removeMusic])
    .plugin(tauri_plugin_store::Builder::default().build())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
