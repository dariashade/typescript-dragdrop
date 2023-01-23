import Component from './base-component.js';
import { DragTarget } from '../models/drag-drop.js';
import Autobind from '../decorators/autobind.js';
import { projectState } from '../state/project-state.js';
import ProjectItem from './project-item.js';
import { Project, ProjectStatus } from '../models/project.js';

export default class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assingnedProjects: Project[];

  constructor(private type: ProjectStatus.Active | ProjectStatus.Finished) {
    super('project-list', 'app', false, `${type}-projects`);

    this.assingnedProjects = [];
    this.configure();
    this.renderContent();
  }

  @Autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  @Autobind
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(projectId, this.type);
  }

  @Autobind
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);

    projectState.addListener((projects: Project[]) => {
      this.assingnedProjects = projects.filter(
        (project: Project) => project.status === this.type
      );
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = '';
    for (const project of this.assingnedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, project);
    }
  }
}
