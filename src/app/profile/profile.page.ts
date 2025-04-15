import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getUser } from '../utils/helpers';

@Component({
  
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  profileForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

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

  private async getUserData(user: User) {
    try {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      return await getDoc(userRef);
    } catch (error) {
      throw error;
    }
  }

  async saveProfile() {
    this.isLoading = true;
    this.errorMessage = null;
  
    try {
      const user = getUser(this.auth);
      if (!user) throw new Error('No user logged in.');
  
      const userRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userRef, this.profileForm.value, { merge: true });
      this.router.navigate(['/tabs/profile']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Error saving profile.';
    } finally {
      this.isLoading = false;
    }
  }
  
  async loadProfile() {
    this.isLoading = true;
    this.errorMessage = null;
    try {
      const user = getUser(this.auth);
      if (!user) throw new Error('No user logged in.');
      const docSnap = await this.getUserData(user);
      if (docSnap.exists()) this.profileForm.patchValue(docSnap.data());
    } catch (error: any) {
      this.errorMessage = error.message || 'Error loading profile.';
    } finally {
      this.isLoading = false;
    }
  }
}
