# 🧚 Winx Gen

> 🚧 **WIP — Work In Progress** 🚧

---

## 🚀 Lancer le projet

### Prérequis

- [Docker](https://www.docker.com/) + Docker Compose installés

### Production / Coolify

```bash
docker compose up --build
```

### Développement local (hot reload)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Puis ouvre **http://localhost:5173** dans ton navigateur.

---

## 🛑 Arrêter

```bash
docker compose down
```

Pour tout supprimer (base de données incluse) :

```bash
docker compose down -v
```
