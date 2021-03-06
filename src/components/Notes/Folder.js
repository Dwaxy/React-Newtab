import React, { Component } from 'react';
import FlipMove from 'react-flip-move';
import File from './File'
import {NoteContext} from '../../routes/Notes'
import ListDummy from './ListDummy'

export class Folder extends Component {
  constructor(props) {
    super(props);
    this.addFile = this.addFile.bind(this);
    this.addDummy = this.addDummy.bind(this);
    this.cancelDummy = this.cancelDummy.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      files: this.getFiles(),
      formInput: "",
      //currentFile: null
    };    
  }
  
  handleChange(e) {
    this.setState({formInput: e.target.value});
  }
  
  getFiles() {
    if(this.props.folderData.fileList != null) {
      return this.props.folderData.fileList
    } else {
      return [];
    }
  }
  
  deleteFile(idx, wasDummy) {
    let fileList = this.state.files;
    fileList.splice(idx, 1); 

    this.setState({
      files: fileList
    });
    if (!wasDummy) {
      this.props.sendSelectedData(null, null);
    }

  }
  
  addDummy(e) {
    e.stopPropagation();
    let fileList = this.state.files;
    fileList.unshift({
      name: this.state.formInput,
      key: "dummyItem",
      isDummy: true
    });
    this.setState({files: fileList, formInput: ""});
  }
  
  cancelDummy() {
    let fileList = this.state.files;
    fileList.map((fileData, idx)=> {
      if (fileList[idx].key === "dummyItem") {
        this.deleteFile(idx, true);
      }
    });
  }

  addFile(e) {
    let fileList = this.state.files;
    fileList.unshift({
      name: this.state.formInput,
      fileEditorState: this.props.emptyEditor,
      key: new Date().getTime(),
      open: false,
      tags: ["white", "black"],
    });
    this.cancelDummy();
    this.setState({files: fileList});
    this.props.sendSelectedData(this.props.folderData, 0);
    e.preventDefault(); 
  }
  
  componentDidUpdate(prevProps) { 
    if ( 
      prevProps.newEditorState !== this.props.newEditorState &&
      //this.state.currentFile !== null && 
      this.props.currentFolder.key == this.props.folderData.key
    ){
      //if new state is in for this file
      //let file = this.state.currentFile;
      //file.fileEditorState = this.props.newEditorState;
      //this.props.folderData.fileEditorState = this.props.newEditorState
      
      // let updatedFile = this.props.folderData[this.props.currentFileIdx];
      // console.log(updatedFile)
      // updatedFile.fileEditorState = this.props.newEditorState;
      // this.props.sendSelectedData(updatedFile, this.props.currentFileIdx);
      
      let updatedFiles = this.state.files
      updatedFiles[this.props.currentFileIdx].fileEditorState = this.props.newEditorState
      this.setState({files: updatedFiles})
    }
  }
  
  returnSelected(open) {
    return open
  }
  
  selectItem(idx, e) {
    e.stopPropagation();
    let files = this.state.files
    let currentFile = this.props.folderData.fileList[idx]
    //let currentFile = this.props.currentFolder.fileList[idx]
    //let currentFile = this.state.currentFile
    if (currentFile !== undefined && currentFile !== null) {
      this.returnSelected( currentFile.open =! currentFile.open );
      this.setState({files: files});
      //this.props.getSelectedData(currentFile, idx);
      this.props.sendSelectedData(this.props.folderData, idx);
      this.props.closeNotOpenFiles();
      //console.log(currentFile)
    }
  }

  render() {
    return (
      <div className="folder-holder">
        <div className="folder-item">
        
          <span className="folder-name">{this.props.folderData.name}</span>
          <span className="add-file" onClick={this.addDummy}>+</span>
          
          <div className="folder-buttons">
            <div>
              <span className="delete-folder" onClick={this.props.delete}> &#10005; </span>
              <span className="editName"> E </span>
              <span className="tags"> ∆ </span>
              
              <div className="folder-meta">
                <span className="no-files">{this.props.folderData.fileList.length} files</span>
                <span className="no-tags">{this.props.folderData.tags.length} tags</span>
              </div>
              
            </div>
          </div>
        
        </div>

        <div className="file-list-holder">
          <ul>
            <FlipMove duration={250} easing="ease-out">
              {this.state.files.map((file, idx) => (
                file.isDummy ? (
                  <ListDummy
                    key={file.key}
                    addItem={this.addFile}
                    inputValue={this.state.formInput} 
                    handleChange={this.handleChange}
                    cancelDummy={this.cancelDummy}
                  />
                ) : (
                <li 
                className="file-item"
                onClick={this.selectItem.bind(this, idx)}
                key={idx}
                >
                  {/*<NoteContext.Consumer>
                    {(context)=>{return( */}
                      <File
                        delete={this.deleteFile.bind(this, idx)}
                        fileData={file}
                      />
                    {/*})}}
                  </NoteContext.Consumer> */}
                </li>
                )
              ))}
            </FlipMove>
          </ul>
        </div>
        
      </div>
    );
  }
}

export default Folder;