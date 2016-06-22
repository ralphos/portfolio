import {
  FETCH_PROJECTS, 
  FETCH_PROJECT, 
  FETCH_NEW_PROJECT, 
  SAVE_PROJECT,
  TOGGLE_PROJECT
} from "shared/constants/actions";
import { PROJECT_PATH } from "shared/constants/apis";
import { fetchTagsForm } from "./tags";
import { createAlert } from "sharedActions/alerts";
import { createAuthorizedRequest, trimProject } from "cms/utilities";
import { browserHistory } from "react-router";

export function fetchProjects() {
  const request = createAuthorizedRequest("get", `${PROJECT_PATH}`);
  return dispatch => {
    return (
      request
        .then(response => dispatch(fetchProjectsSuccess(response.data)))
        .catch(error => dispatch(createAlert(error.data, "error")))
    )
  }
}

function fetchProjectsSuccess(response) {
  return {
    type: FETCH_PROJECTS.SUCCESS,
    payload: {
      projects: response.projects
    }
  }
}

export function fetchProject(id) {
  const request = createAuthorizedRequest("get", `${PROJECT_PATH}/${id}/edit`);
  return dispatch => {
    return request
      .then(response => dispatch(fetchProjectSuccess(response.data)))
      .then(response => dispatch(fetchTagsForm(response.payload.tags)))
      .catch(error => dispatch(createAlert(error.data, "error")))
  };
}

function fetchProjectSuccess(response) {
  return {
    type: FETCH_PROJECT.SUCCESS,
    payload: {
      project: response,
      tags: {
        tags: response.tags,
        tagSuggestions: response.tagSuggestions
      }
    }
  };
}

export function fetchNewProject() {
  const request = createAuthorizedRequest("get", `${PROJECT_PATH}/new`);
  return dispatch => {
    return request
      .then(response => dispatch(fetchNewProjectSuccess(response.data)))
      .then(response => dispatch(fetchTagsForm(response.payload.tags)))
      .catch(error => dispatch(createAlert(error.data, "error")))
    }
};


function fetchNewProjectSuccess(response) {
  return {
    type: FETCH_NEW_PROJECT.SUCCESS,
    payload: { 
      tags: { 
        tags: [], 
        tagSuggestions: response.tagSuggestions 
      }
    }
  };
}


export function saveProject(props) {
  const project = trimProject(props.project);
  let request;
  if (project.id) {
    request = createAuthorizedRequest("patch",`${PROJECT_PATH}/${project.id}`, { project });
  } else {
    request = createAuthorizedRequest("post", `${PROJECT_PATH}`, { project });
  }
  return dispatch => {
    // dispatch(saveProjectRequest());
    return (
      request
      .then(() => dispatch(saveProjectSuccess()))
      .catch(error => dispatch(saveProjectFailure(error.data)))
    )
  }
}


function saveProjectRequest() {
  return {
    type: SAVE_PROJECT.REQUEST
  }
}

function saveProjectSuccess() {
  browserHistory.push("/cms/projects");
  return {
    type: SAVE_PROJECT.SUCCESS
  }
}

function saveProjectFailure(response) {
  return {
    type: SAVE_PROJECT.FAILURE,
    payload: {
      errorMessage: response.errorMessage 
    }
  }
}

export function toggleProject(sortRank, id) {
  const request = createAuthorizedRequest("patch", `${PROJECT_PATH}/${id}/acceptance`);
  return dispatch => {
    return request
      .then(response => dispatch(toggleProjectSuccess(sortRank, response.data)))
      .catch(error => dispatch(createAlert(error.data, "error")))
  }
}

function toggleProjectSuccess(sortRank, response) {
  return {
    type: TOGGLE_PROJECT.SUCCESS,
    payload: { 
      sortRank,
      accepted: response.accepted
    }
  }
}

