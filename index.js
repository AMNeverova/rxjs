import './src/style/style.scss';
import { fromEvent } from 'rxjs';
import { map, throttleTime } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

class UsersManager {
    constructor() {
        const refreshButton = document.querySelector('.refresh-button');
        this.usersArea = document.querySelector('.users');
        ajax('https://api.github.com/users').pipe(
            map(data => data.response)
        ).subscribe(data => {
            this.urls = data.map(user => user.url);
            this.requests = this.urls.map(url => fetch(url));
            Promise.all(this.requests)
                .then(responses => Promise.all(responses.map(res => res.json())))
                .then(responses => {
                    this.usersList = responses.map( ({id, name, location, login, avatar_url}) => {
                        let userWithRequiredData = {};
                        userWithRequiredData.id = id;
                        userWithRequiredData.location = location;
                        userWithRequiredData.name = name;
                        userWithRequiredData.login = login;
                        userWithRequiredData.avatarUrl = avatar_url;
                        return userWithRequiredData;
                    });
                    this.refreshUsers();
                })
        });

        fromEvent(refreshButton, 'click')
        .subscribe( () => this.refreshUsers());
    }

    refreshUsers() {
        this.fillUsersToRender();
        this.render();
    }

    fillUsersToRender() {
        this.usersToRender = [];
        for (let i = 0; i < 3; i++) {
            this.max = this.usersList.length - 1;
            let num = this.getRandomInt(0, this.max);
            this.usersToRender.push({...this.usersList[num]})
        }
    }

    createUserNode(user) {
        let userNode = document.createElement('div');
        userNode.classList.add('user');
        let photoNode = this.createPhotoNode(user.avatarUrl);
        let userInfoNode = this.createUserInfoNode(user);
        let arrowNode = this.createArrowNode();
        let trashbinNode = this.createTrashbinNode(user.id);
        userNode.appendChild(photoNode);
        userNode.appendChild(userInfoNode);
        userNode.appendChild(arrowNode);
        userNode.appendChild(trashbinNode);
        this.setMouseEnterObservable(arrowNode, trashbinNode);
        this.setMouseLeaveObservable(trashbinNode);
        this.setTrashbinClickObservable(trashbinNode);
        return userNode;
    }

    setTrashbinClickObservable(trashbinNode) {
        return fromEvent(trashbinNode, 'click')
        .subscribe( evt => {
            let id = parseInt(evt.target.getAttribute('data-id'));
            let index = this.usersToRender.findIndex( user => user.id === id);
            let num = this.getRandomInt(0, this.max);
            let newUser = {...this.usersList[num]};
            this.usersToRender[index] = newUser;
            this.render();
        })
    }

    createTrashbinNode(id) {
        let trashbinNode = document.createElement('div');
        trashbinNode.classList.add('trashbin');
        trashbinNode.setAttribute('data-id', id)
        return trashbinNode;
    }

    createArrowNode() {
        let arrowNode = document.createElement('div');
        arrowNode.classList.add('arrow-block');
        let arrowSignNode = document.createElement('p');
        arrowSignNode.classList.add('arrow-sign');
        arrowNode.appendChild(arrowSignNode);
        return arrowNode;
    }

    setMouseEnterObservable(arrowTag, trashbinTag) {
        return fromEvent(arrowTag, 'mouseenter').pipe(throttleTime(1000))
            .subscribe(() => {
                trashbinTag.classList.add('show');
                setTimeout(() => {
                    trashbinTag.classList.remove('show')
                }, 10000)
            });
    }

    setMouseLeaveObservable(trashbinTag) {
        fromEvent(trashbinTag, 'mouseleave')
            .subscribe(() => {
                trashbinTag.classList.remove('show');
            });

    }

    createUserInfoNode(user) {
        let userInfoNode = document.createElement('div');
        userInfoNode.classList.add('user-info');
        let userNameNode = document.createElement('div');
        userNameNode.classList.add('username');
        userNameNode.innerHTML = user.name;
        let userLocationNode = document.createElement('div');
        userLocationNode.classList.add('user-location');
        userLocationNode.innerHTML = user.location;
        let userLoginNode = document.createElement('div');
        userLoginNode.classList.add('user-login');
        userLoginNode.innerHTML = `@${user.login}`;
        userInfoNode.appendChild(userNameNode);
        userInfoNode.appendChild(userLocationNode);
        userInfoNode.appendChild(userLoginNode);
        return userInfoNode;
    }

    createPhotoNode(url) {
        let photoNode = document.createElement('div');
        photoNode.classList.add('photo');
        let photoFrame = document.createElement('div');
        photoFrame.classList.add('photo__frame');
        photoFrame.style.backgroundImage = `url('${url}')`;
        photoNode.append(photoFrame);
        return photoNode;
    }

    render() {
        this.usersArea.innerHTML = null;
        this.usersToRender.forEach(user => {
            let userNode = this.createUserNode(user);
            this.usersArea.appendChild(userNode);
        })
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

let manager = new UsersManager();
