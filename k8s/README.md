# K8S easyflow

Set the kube config var env: `export KUBECONFIG=<path to config file>`

## Install required software

For linux user

```bash
snap install kustomize
sudo apt install gnupg
wget https://github.com/mozilla/sops/releases/download/v3.7.1/sops_3.7.1_amd64.deb
sudo apt install ./sops_3.7.1_amd64.deb
```

**Note** you can get the last version of sops [here](https://github.com/mozilla/sops/releases)

For mac user

```bash
brew install kustomize gnupg sops
```

## Secret

See what he will apply

```bash
sops -d bases/docker-registry-secret.yaml
```

Apply secret

```bash
sops -d bases/docker-registry-secret.yaml | kubectl apply -f -
sops -d bases/secrets.yaml | kubectl apply -f -
```


## Apply resources

First you need to set the `kustomization.template.yaml` file. In this template file you have one env var `CI_COMMIT_TAG`
he used to define witch api docker image to use.

To see all available tags you can
go [here](https://gitlab.infomaniak.ch/infomaniak/ai-advanced-search/container_registry/1637)

```bash
export CI_COMMIT_TAG=latest
envsubst < overlays/alpha/kustomization.template.yaml > overlays/alpha/kustomization.yaml
```

See what will be applied

```bash
kustomize build ./overlays/master
```

Apply resources

```bash
kustomize build ./overlays/master | kubectl apply -f -
```

## Create encrypt secret

Create gpg key

```bash
gpg --full-generate-key
```

Then get the pub key with this command

```bash
gpg --list-keys
```

Here an output example

```
pub   rsa3072 2021-04-26 [SC]
      8FAE828C21C966E2B5E078FFEB8BACBABE1B6150
uid          [  ultime ] testKey <testkey@test.fr>
sub   rsa3072 2021-04-26 [E]
```

The pub key is: `8FAE828C21C966E2B5E078FFEB8BACBABE1B6150`

Copy the pub key and paste that key into the `.sops.yaml`

```yaml
---
creation_rules:
  - pgp: >-
      7120085A6161EB9ABC2FZ0117C26F0446A4D9R03,
    encrypted_regex: '^(data|stringData)$'
```

Encode the pwd to base64

```bash
echo -n "paswword" | base64
```

Add into the secret yaml file `config-secret.yaml` for example

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: config-secret
type: Opaque
data:
  PASSWORD: cGFzd3dvcmQ=
```

**Note** You can use `env_to_secret.py` python script. He will read a .env file and encode into base64.

```bash
python env_to_secret.py .env out.txt
```

Then you can copy and paste the content of `out.txt` into your secret file

Encrypt the secret yaml file with sops

```bash
sops -e -i bases/docker-registry-secret.yaml && sops -e -i bases/secrets.yaml
```

## Useful command

Restart a deployment

```bash
kubectl rollout restart deployment api-server
```

Restart preproduction

```bash
kustomize build ./overlays/master | kubectl rollout restart deployment -f -
```

Port forwarding

```bash
kubectl port-forward <pod name> 3306:3306
```
Gett all namepsace

```bash
kubectl get all --all-namespaces
```
