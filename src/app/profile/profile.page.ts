import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  profileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(10), Validators.max(100)]],
      height: ['', [Validators.required, Validators.min(100), Validators.max(250)]],
      weight: ['', [Validators.required, Validators.min(30), Validators.max(200)]],
      goal: ['', Validators.required]
    });

    this.loadProfile();
  }

  async loadProfile() {
    const user = this.auth.currentUser;
    if (!user) return;

    const userRef = doc(this.firestore, `users/${user.uid}`);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      this.profileForm.patchValue(docSnap.data());
    }
  }

  async saveProfile() {
    const user = this.auth.currentUser;
    if (!user) return;

    const userRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userRef, this.profileForm.value, { merge: true });

    this.router.navigate(['/home']); // Redirigir al home
  }
}
