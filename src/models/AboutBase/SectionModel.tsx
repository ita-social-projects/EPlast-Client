import SubSectionModel from './SubsectionModel';
export default class Section{
    id: number;
    title: string;
    subsection:SubSectionModel;
    constructor(){
        this.id = 0;
        this.title = "";
        this.subsection = new SubSectionModel; 
    }
}
